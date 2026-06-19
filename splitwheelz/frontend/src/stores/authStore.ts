import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onAuthChange, signInWithGoogle, signOutUser, getIdToken } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar: string | null
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isEmailVerified: boolean
  isPhoneVerified: boolean
  kycVerified: boolean
  loyaltyPoints: number
  referralCode: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  initAuth: () => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setUser: (user: AuthUser) => void
  updateUser: (updates: Partial<AuthUser>) => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      refreshToken: null,

      initAuth: () => {
        onAuthChange(async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const idToken = await firebaseUser.getIdToken()
              const storedToken = get().accessToken

              if (!storedToken) {
                const { data } = await authApi.login(idToken)
                if (data.success) {
                  const { user, accessToken, refreshToken } = data.data
                  localStorage.setItem('accessToken', accessToken)
                  localStorage.setItem('refreshToken', refreshToken)
                  set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    accessToken,
                    refreshToken,
                  })
                }
              } else {
                set({ isLoading: false })
              }
            } catch {
              set({ isLoading: false })
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              accessToken: null,
              refreshToken: null,
            })
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }
        })
      },

      loginWithGoogle: async () => {
        try {
          const firebaseUser = await signInWithGoogle()
          const idToken = await getIdToken()
          if (!idToken) throw new Error('Failed to get ID token')

          const { data } = await authApi.login(idToken)
          if (data.success) {
            const { user, accessToken, refreshToken } = data.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            set({
              user,
              isAuthenticated: true,
              accessToken,
              refreshToken,
            })
            toast.success(`Welcome, ${user.name}!`)
          }
        } catch (err: unknown) {
          const error = err as { message?: string }
          toast.error(error?.message || 'Login failed')
          throw err
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
          await signOutUser()
        } catch {
          // ignore
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        })
        toast.success('Logged out successfully')
      },

      setUser: (user: AuthUser) => set({ user, isAuthenticated: true }),

      updateUser: (updates: Partial<AuthUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({ accessToken, refreshToken })
      },
    }),
    {
      name: 'splitwheelz-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
