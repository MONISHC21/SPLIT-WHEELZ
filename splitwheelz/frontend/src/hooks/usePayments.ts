import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentApi } from '@/lib/api'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open: () => void
  close: () => void
}

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => paymentApi.createOrder(data),
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => paymentApi.verify(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-payments'] })
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Payment successful! Booking confirmed.')
    },
    onError: (err: unknown) => {
      const error = err as { message?: string }
      toast.error(error?.message || 'Payment verification failed')
    },
  })
}

export function useMyPayments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['my-payments', params],
    queryFn: async () => {
      const { data } = await paymentApi.getMy(params)
      return data.data
    },
  })
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: async () => {
      const { data } = await paymentApi.getStats()
      return data.data
    },
  })
}

export function useRazorpay() {
  const createOrder = useCreatePaymentOrder()
  const verifyPayment = useVerifyPayment()

  const initiatePayment = async (
    orderData: Record<string, unknown>,
    userDetails: { name?: string; email?: string; phone?: string },
    onSuccess?: () => void
  ) => {
    try {
      const { data } = await createOrder.mutateAsync(orderData)
      const { orderId, amount, currency, paymentId, keyId } = data.data

      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
        await new Promise((resolve) => (script.onload = resolve))
      }

      const options: RazorpayOptions = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount,
        currency: currency || 'INR',
        name: 'SplitWheelz',
        description: 'Vehicle booking payment',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          await verifyPayment.mutateAsync({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId,
          })
          onSuccess?.()
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: '#2563EB' },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error?.message || 'Failed to initiate payment')
    }
  }

  return { initiatePayment, isLoading: createOrder.isPending || verifyPayment.isPending }
}
