import { PrismaClient, VehicleType, FuelType, VehicleStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const VEHICLE_IMAGES = {
  sedan: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  ],
  suv: [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  ],
  electric: [
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
  ],
};

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@splitwheelz.com' },
    update: {},
    create: {
      firebaseUid: 'admin-firebase-uid-12345',
      email: 'admin@splitwheelz.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      kycVerified: true,
      phone: '+91-9000000000',
      city: 'Bangalore',
      state: 'Karnataka',
    },
  });

  // Create regular users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'priya.sharma@example.com' },
      update: {},
      create: {
        firebaseUid: 'user-firebase-uid-001',
        email: 'priya.sharma@example.com',
        name: 'Priya Sharma',
        phone: '+91-9876543210',
        role: UserRole.USER,
        isEmailVerified: true,
        kycVerified: true,
        city: 'Bangalore',
        state: 'Karnataka',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        loyaltyPoints: 250,
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahul.verma@example.com' },
      update: {},
      create: {
        firebaseUid: 'user-firebase-uid-002',
        email: 'rahul.verma@example.com',
        name: 'Rahul Verma',
        phone: '+91-9876543211',
        role: UserRole.USER,
        isEmailVerified: true,
        kycVerified: true,
        city: 'Mumbai',
        state: 'Maharashtra',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
        loyaltyPoints: 180,
      },
    }),
    prisma.user.upsert({
      where: { email: 'ananya.krishnan@example.com' },
      update: {},
      create: {
        firebaseUid: 'user-firebase-uid-003',
        email: 'ananya.krishnan@example.com',
        name: 'Ananya Krishnan',
        phone: '+91-9876543212',
        role: UserRole.USER,
        isEmailVerified: true,
        kycVerified: true,
        city: 'Chennai',
        state: 'Tamil Nadu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
        loyaltyPoints: 320,
      },
    }),
    prisma.user.upsert({
      where: { email: 'arjun.patel@example.com' },
      update: {},
      create: {
        firebaseUid: 'user-firebase-uid-004',
        email: 'arjun.patel@example.com',
        name: 'Arjun Patel',
        phone: '+91-9876543213',
        role: UserRole.USER,
        isEmailVerified: true,
        kycVerified: false,
        city: 'Ahmedabad',
        state: 'Gujarat',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
        loyaltyPoints: 90,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length + 1} users`);

  // Create vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { registrationNumber: 'KA-01-AB-1234' },
      update: {},
      create: {
        make: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        registrationNumber: 'KA-01-AB-1234',
        color: 'Pearl White',
        type: VehicleType.SUV,
        fuelType: FuelType.DIESEL,
        transmission: 'automatic',
        seatingCapacity: 7,
        engineCC: 2755,
        mileage: 14.5,
        images: [...VEHICLE_IMAGES.suv],
        description: 'Premium 7-seater SUV perfect for family and adventure trips. Fully loaded with all modern amenities.',
        features: ['Sunroof', 'Leather Seats', '360° Camera', 'Android Auto', 'Apple CarPlay', 'Cruise Control', '7 Airbags'],
        totalSlots: 4,
        availableSlots: 2,
        pricePerSlot: 45000,
        monthlyMaintenanceCost: 3500,
        insuranceCost: 12000,
        location: 'Koramangala, Bangalore',
        latitude: 12.9279,
        longitude: 77.6271,
        status: VehicleStatus.AVAILABLE,
        isVerified: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 12,
        addedById: adminUser.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: 'MH-01-CD-5678' },
      update: {},
      create: {
        make: 'BMW',
        model: '3 Series',
        year: 2023,
        registrationNumber: 'MH-01-CD-5678',
        color: 'Carbon Black',
        type: VehicleType.LUXURY,
        fuelType: FuelType.PETROL,
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCC: 1998,
        mileage: 16.2,
        images: [...VEHICLE_IMAGES.luxury],
        description: 'Experience the ultimate driving machine. Premium luxury sedan with top-of-the-line features.',
        features: ['Panoramic Sunroof', 'Harman Kardon Sound', 'BMW ConnectedDrive', 'Ambient Lighting', 'Heated Seats', 'Adaptive Cruise Control'],
        totalSlots: 2,
        availableSlots: 1,
        pricePerSlot: 85000,
        monthlyMaintenanceCost: 8000,
        insuranceCost: 25000,
        location: 'Bandra, Mumbai',
        latitude: 19.0596,
        longitude: 72.8295,
        status: VehicleStatus.AVAILABLE,
        isVerified: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 8,
        addedById: adminUser.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: 'TN-09-EF-9012' },
      update: {},
      create: {
        make: 'Tata',
        model: 'Nexon EV',
        year: 2023,
        registrationNumber: 'TN-09-EF-9012',
        color: 'Intensi-Teal',
        type: VehicleType.ELECTRIC,
        fuelType: FuelType.ELECTRIC,
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCC: 0,
        mileage: 312,
        images: [...VEHICLE_IMAGES.electric],
        description: 'Go green with India\'s most loved electric SUV. Zero emissions, maximum fun.',
        features: ['312km Range', 'Fast Charging', 'Connected Car Tech', 'iRA Tech', 'Ventilated Seats', 'Air Purifier'],
        totalSlots: 3,
        availableSlots: 3,
        pricePerSlot: 35000,
        monthlyMaintenanceCost: 1500,
        insuranceCost: 10000,
        location: 'Anna Nagar, Chennai',
        latitude: 13.0847,
        longitude: 80.2104,
        status: VehicleStatus.AVAILABLE,
        isVerified: true,
        isFeatured: false,
        averageRating: 4.6,
        totalReviews: 15,
        addedById: adminUser.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: 'DL-01-GH-3456' },
      update: {},
      create: {
        make: 'Honda',
        model: 'City',
        year: 2022,
        registrationNumber: 'DL-01-GH-3456',
        color: 'Lunar Silver',
        type: VehicleType.SEDAN,
        fuelType: FuelType.PETROL,
        transmission: 'manual',
        seatingCapacity: 5,
        engineCC: 1498,
        mileage: 17.8,
        images: [...VEHICLE_IMAGES.sedan],
        description: 'India\'s best-selling sedan. Elegant, fuel-efficient, and packed with features.',
        features: ['Sunroof', 'Honda Sensing', 'LaneWatch', 'ADAS', 'Wireless Charging', 'Rear AC Vents'],
        totalSlots: 4,
        availableSlots: 4,
        pricePerSlot: 22000,
        monthlyMaintenanceCost: 2000,
        insuranceCost: 7000,
        location: 'Dwarka, New Delhi',
        latitude: 28.5921,
        longitude: 77.0460,
        status: VehicleStatus.AVAILABLE,
        isVerified: true,
        isFeatured: false,
        averageRating: 4.4,
        totalReviews: 20,
        addedById: adminUser.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: 'KL-07-IJ-7890' },
      update: {},
      create: {
        make: 'Hyundai',
        model: 'Creta',
        year: 2023,
        registrationNumber: 'KL-07-IJ-7890',
        color: 'Typhoon Silver',
        type: VehicleType.SUV,
        fuelType: FuelType.PETROL,
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCC: 1497,
        mileage: 16.8,
        images: [VEHICLE_IMAGES.suv[0], 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800'],
        description: 'Award-winning compact SUV with best-in-class features and connected tech.',
        features: ['Bluelink Connected Car', 'BOSE Sound', 'Ventilated Front Seats', 'Panoramic Sunroof', '360° Camera'],
        totalSlots: 2,
        availableSlots: 2,
        pricePerSlot: 30000,
        monthlyMaintenanceCost: 2500,
        insuranceCost: 9000,
        location: 'Infopark, Kochi',
        latitude: 10.0261,
        longitude: 76.3286,
        status: VehicleStatus.AVAILABLE,
        isVerified: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 18,
        addedById: adminUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Create ownerships
  await Promise.all([
    prisma.vehicleOwnership.upsert({
      where: { vehicleId_userId: { vehicleId: vehicles[0].id, userId: users[0].id } },
      update: {},
      create: {
        vehicleId: vehicles[0].id,
        userId: users[0].id,
        slotNumber: 1,
        ownershipShare: 25,
        purchasePrice: 45000,
        status: 'ACTIVE',
        isAdmin: true,
        weeklyHours: 42,
      },
    }),
    prisma.vehicleOwnership.upsert({
      where: { vehicleId_userId: { vehicleId: vehicles[0].id, userId: users[1].id } },
      update: {},
      create: {
        vehicleId: vehicles[0].id,
        userId: users[1].id,
        slotNumber: 2,
        ownershipShare: 25,
        purchasePrice: 45000,
        status: 'ACTIVE',
        weeklyHours: 42,
      },
    }),
    prisma.vehicleOwnership.upsert({
      where: { vehicleId_userId: { vehicleId: vehicles[1].id, userId: users[2].id } },
      update: {},
      create: {
        vehicleId: vehicles[1].id,
        userId: users[2].id,
        slotNumber: 1,
        ownershipShare: 50,
        purchasePrice: 85000,
        status: 'ACTIVE',
        isAdmin: true,
        weeklyHours: 84,
      },
    }),
  ]);

  console.log('✅ Created ownerships');

  // Create sample bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(17, 0, 0, 0);

  await prisma.booking.create({
    data: {
      vehicleId: vehicles[0].id,
      userId: users[0].id,
      startTime: tomorrow,
      endTime: tomorrowEnd,
      durationHours: 8,
      purpose: 'Family outing',
      pickupLocation: 'Home',
      dropLocation: 'Home',
      status: 'CONFIRMED',
      totalAmount: 1200,
      finalAmount: 1200,
      paymentStatus: 'COMPLETED',
    },
  });

  console.log('✅ Created sample bookings');

  // Create chat room for vehicle 1
  const chatRoom = await prisma.chatRoom.create({
    data: {
      vehicleId: vehicles[0].id,
      name: `${vehicles[0].make} ${vehicles[0].model} Owners`,
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        roomId: chatRoom.id,
        userId: users[0].id,
        message: 'Hey everyone! Quick reminder — the vehicle needs an oil change next week. Shall we schedule it for Saturday?',
      },
      {
        roomId: chatRoom.id,
        userId: users[1].id,
        message: 'Saturday works for me! I can drop it at the service center by 9 AM.',
      },
      {
        roomId: chatRoom.id,
        userId: users[0].id,
        message: 'Perfect! I\'ll book the slot. The cost should split 50-50 between us.',
      },
    ],
  });

  console.log('✅ Created chat messages');

  // Create notifications for users
  await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        title: 'Welcome to SplitWheelz! 🚗',
        body: 'Start co-owning vehicles and save big. Explore the marketplace.',
        type: 'WELCOME',
        isRead: true,
      },
      {
        userId: users[0].id,
        title: 'Booking Confirmed',
        body: 'Your booking for Toyota Fortuner tomorrow at 9 AM is confirmed.',
        type: 'BOOKING_CONFIRMED',
      },
      {
        userId: users[1].id,
        title: 'Maintenance Due',
        body: 'Toyota Fortuner is due for oil change in 7 days.',
        type: 'MAINTENANCE_REMINDER',
      },
    ],
  });

  console.log('✅ Created notifications');
  console.log('\n🎉 Database seeded successfully!');
  console.log(`\nAdmin: admin@splitwheelz.com`);
  console.log(`Users: priya.sharma@example.com, rahul.verma@example.com, ananya.krishnan@example.com`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
