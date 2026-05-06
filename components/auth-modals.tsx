'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Linkedin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'

// ─── Schemas ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type LoginForm = z.infer<typeof loginSchema>

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type SignupForm = z.infer<typeof signupSchema>

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
})
type ForgotForm = z.infer<typeof forgotSchema>

// ─── Google/LinkedIn stub button ───────────────────────────────────────────

function SocialButton({ provider, action }: { provider: 'Google' | 'LinkedIn'; action: 'in' | 'up' }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={() => toast.info(`${provider} sign-${action} coming soon`)}
    >
      {provider === 'Google' ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ) : (
        <Linkedin className="w-4 h-4 text-blue-700" />
      )}
      Sign {action === 'in' ? 'in' : 'up'} with {provider}
    </Button>
  )
}

// ─── Forgot Password (inline view) ─────────────────────────────────────────

function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500))
    toast.success('Password reset link sent to your email')
    onBack()
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Reset Password</h3>
        <p className="text-sm text-stone-500 mt-1">Enter your email to receive a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="forgot-email">Email</Label>
          <Input id="forgot-email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold"
        >
          {isSubmitting ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-amber-800 hover:underline"
      >
        ← Back to Login
      </button>
    </div>
  )
}

// ─── Login Modal ────────────────────────────────────────────────────────────

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export function LoginModal({ open, onClose, onSwitchToSignup }: LoginModalProps) {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      toast.error(json.error || 'Login failed')
      return
    }
    login(json.token, json.user)
    toast.success(`Welcome back, ${json.user.name}!`)
    reset()
    onClose()
    router.push('/chat')
  }

  const handleClose = () => {
    reset()
    setShowForgot(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {!showForgot && <DialogTitle className="text-xl font-bold text-stone-900">Sign in to GeoLegal</DialogTitle>}
        </DialogHeader>

        {showForgot ? (
          <ForgotPasswordView onBack={() => setShowForgot(false)} />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <SocialButton provider="Google" action="in" />
              <SocialButton provider="LinkedIn" action="in" />
            </div>
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-stone-200" />
              <span className="mx-3 text-xs text-stone-400">or</span>
              <div className="flex-1 border-t border-stone-200" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                <button
                  type="button"
                  className="text-xs text-amber-800 hover:underline mt-1"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
            <p className="text-center text-sm text-stone-500">
              No account?{' '}
              <button
                type="button"
                className="text-amber-800 font-medium hover:underline"
                onClick={() => { handleClose(); onSwitchToSignup() }}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Signup Modal ───────────────────────────────────────────────────────────

interface SignupModalProps {
  open: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function SignupModal({ open, onClose, onSwitchToLogin }: SignupModalProps) {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast.error(json.error || 'Registration failed')
      return
    }
    login(json.token, json.user)
    toast.success(`Welcome to GeoLegal, ${json.user.name}!`)
    reset()
    onClose()
    router.push('/chat')
  }

  const handleClose = () => { reset(); onClose() }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900">Create your account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <SocialButton provider="Google" action="up" />
            <SocialButton provider="LinkedIn" action="up" />
          </div>
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-stone-200" />
            <span className="mx-3 text-xs text-stone-400">or</span>
            <div className="flex-1 border-t border-stone-200" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input id="signup-name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className="pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold"
            >
              {isSubmitting ? 'Creating account…' : 'Get Started'}
            </Button>
          </form>
          <p className="text-center text-sm text-stone-500">
            Already have an account?{' '}
            <button
              type="button"
              className="text-amber-800 font-medium hover:underline"
              onClick={() => { handleClose(); onSwitchToLogin() }}
            >
              Sign in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
