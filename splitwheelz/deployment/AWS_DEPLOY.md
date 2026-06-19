# SplitWheelz AWS Deployment Guide

## Architecture Overview

```
Internet
    │
    ▼
CloudFront (CDN + SSL)
    │
    ▼
Application Load Balancer (ALB)
    │
    ├──► ECS Fargate (Frontend – React/Nginx) :80
    │
    └──► ECS Fargate (Backend – Node.js/Express) :5000
              │
              ├──► RDS PostgreSQL (Multi-AZ)
              ├──► ElastiCache Redis (Messages, Sessions)
              └──► S3 (File Storage)
```

## Prerequisites

- AWS CLI configured with admin credentials
- Docker installed locally
- Terraform (optional – for IaC)
- Domain name in Route 53

---

## Step 1: AWS ECR (Container Registry)

```bash
# Create ECR repositories
aws ecr create-repository --repository-name splitwheelz/frontend --region ap-south-1
aws ecr create-repository --repository-name splitwheelz/backend --region ap-south-1

# Log in to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push frontend
cd frontend
docker build -t splitwheelz-frontend .
docker tag splitwheelz-frontend:latest \
  <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/splitwheelz/frontend:latest
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/splitwheelz/frontend:latest
```

---

## Step 2: VPC and Networking

```bash
# Create VPC with public and private subnets across 2 AZs
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications \
  'ResourceType=vpc,Tags=[{Key=Name,Value=splitwheelz-vpc}]'

# Create subnets (replace VPC_ID with your actual VPC ID)
# Public subnets (for ALB)
aws ec2 create-subnet --vpc-id VPC_ID --cidr-block 10.0.1.0/24 \
  --availability-zone ap-south-1a --tag-specifications \
  'ResourceType=subnet,Tags=[{Key=Name,Value=public-1a}]'

aws ec2 create-subnet --vpc-id VPC_ID --cidr-block 10.0.2.0/24 \
  --availability-zone ap-south-1b --tag-specifications \
  'ResourceType=subnet,Tags=[{Key=Name,Value=public-1b}]'

# Private subnets (for ECS, RDS)
aws ec2 create-subnet --vpc-id VPC_ID --cidr-block 10.0.10.0/24 \
  --availability-zone ap-south-1a --tag-specifications \
  'ResourceType=subnet,Tags=[{Key=Name,Value=private-1a}]'
```

---

## Step 3: RDS PostgreSQL

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name splitwheelz-db-subnet \
  --db-subnet-group-description "SplitWheelz DB Subnets" \
  --subnet-ids subnet-PRIVATE1 subnet-PRIVATE2

# Create PostgreSQL database
aws rds create-db-instance \
  --db-instance-identifier splitwheelz-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username splitwheelz_admin \
  --master-user-password <STRONG_PASSWORD> \
  --allocated-storage 100 \
  --storage-encrypted \
  --multi-az \
  --db-subnet-group-name splitwheelz-db-subnet \
  --no-publicly-accessible \
  --tags Key=Project,Value=SplitWheelz
```

---

## Step 4: ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id splitwheelz-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --cache-subnet-group-name splitwheelz-redis-subnet
```

---

## Step 5: S3 Buckets

```bash
# Create S3 buckets
aws s3 mb s3://splitwheelz-uploads-prod --region ap-south-1
aws s3 mb s3://splitwheelz-backups-prod --region ap-south-1

# Enable versioning on uploads bucket
aws s3api put-bucket-versioning \
  --bucket splitwheelz-uploads-prod \
  --versioning-configuration Status=Enabled

# CORS configuration for uploads bucket
cat > cors.json << 'EOF'
{
  "CORSRules": [{
    "AllowedOrigins": ["https://splitwheelz.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}
EOF

aws s3api put-bucket-cors \
  --bucket splitwheelz-uploads-prod \
  --cors-configuration file://cors.json
```

---

## Step 6: ECS Cluster and Services

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name splitwheelz-prod \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1

# Create task definition (frontend)
cat > frontend-task.json << 'EOF'
{
  "family": "splitwheelz-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [{
    "name": "frontend",
    "image": "ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/splitwheelz/frontend:latest",
    "portMappings": [{"containerPort": 80, "protocol": "tcp"}],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/splitwheelz-frontend",
        "awslogs-region": "ap-south-1",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}
EOF

aws ecs register-task-definition --cli-input-json file://frontend-task.json

# Create ECS Service
aws ecs create-service \
  --cluster splitwheelz-prod \
  --service-name splitwheelz-frontend \
  --task-definition splitwheelz-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration \
    "awsvpcConfiguration={subnets=[PRIVATE_SUBNET1,PRIVATE_SUBNET2],securityGroups=[SG_ID],assignPublicIp=DISABLED}" \
  --load-balancers \
    "targetGroupArn=TARGET_GROUP_ARN,containerName=frontend,containerPort=80"
```

---

## Step 7: Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name splitwheelz-alb \
  --subnets PUBLIC_SUBNET1 PUBLIC_SUBNET2 \
  --security-groups ALB_SG_ID \
  --type application

# Create target groups
aws elbv2 create-target-group \
  --name splitwheelz-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id VPC_ID \
  --target-type ip \
  --health-check-path /health

# Create HTTPS listener (port 443)
aws elbv2 create-listener \
  --load-balancer-arn ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --certificates CertificateArn=CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=FRONTEND_TG_ARN
```

---

## Step 8: CloudFront Distribution

```bash
cat > cloudfront-config.json << 'EOF'
{
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "splitwheelz-alb",
      "DomainName": "splitwheelz-alb-XXXX.ap-south-1.elb.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "https-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "splitwheelz-alb",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["splitwheelz.com", "www.splitwheelz.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "Enabled": true
}
EOF

aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

---

## Step 9: Route 53 DNS

```bash
# Get your CloudFront domain
CF_DOMAIN="XXXX.cloudfront.net"

# Create A record (alias to CloudFront)
cat > dns-change.json << 'EOF'
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "splitwheelz.com",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "Z2FDTNDATAQYW2",
        "DNSName": "CF_DOMAIN",
        "EvaluateTargetHealth": false
      }
    }
  }]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id HOSTED_ZONE_ID \
  --change-batch file://dns-change.json
```

---

## Step 10: GitHub Actions Secrets

Add these secrets to your GitHub repository (`Settings → Secrets`):

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key with ECS, ECR, CloudFront permissions |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID |
| `VITE_API_URL` | Backend API URL (e.g., `https://api.splitwheelz.com`) |
| `VITE_RAZORPAY_KEY` | Razorpay publishable key |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `SLACK_WEBHOOK_URL` | Slack webhook for deployment notifications |

---

## Monitoring & Observability

```bash
# CloudWatch log groups
aws logs create-log-group --log-group-name /ecs/splitwheelz-frontend
aws logs create-log-group --log-group-name /ecs/splitwheelz-backend

# Set retention policy (30 days)
aws logs put-retention-policy \
  --log-group-name /ecs/splitwheelz-frontend \
  --retention-in-days 30

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name splitwheelz-cpu-high \
  --alarm-description "ECS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions SNS_TOPIC_ARN
```

---

## Estimated Monthly Cost (Mumbai Region)

| Service | Config | Est. Cost |
|---------|--------|-----------|
| ECS Fargate (Frontend 2x) | 0.5 vCPU, 1GB | ~$35/mo |
| ECS Fargate (Backend 2x) | 1 vCPU, 2GB | ~$70/mo |
| RDS PostgreSQL (Multi-AZ) | db.t3.medium | ~$80/mo |
| ElastiCache Redis | cache.t3.micro | ~$15/mo |
| ALB | Standard | ~$25/mo |
| CloudFront | 1TB transfer | ~$20/mo |
| S3 | 100GB + requests | ~$5/mo |
| Route 53 | 1 hosted zone | ~$1/mo |
| **Total** | | **~$251/mo** |

*Costs vary based on traffic. Use Savings Plans for 30-40% savings on Fargate.*
