import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { FiloLogo } from '@/components/ui/FiloLogo'
import { registerUser } from '@/services/auth'
import type { ApiError } from '@/types'
import { cn } from '@/utils/cn'
import registerImage from '@/assets/img/977cf677c4196f0beb14f1099bb8733c.jpg'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      await registerUser(data)
      navigate('/auth/login?returnUrl=/dashboard')
    } catch (err) {
      const apiErr = err as ApiError
      const message =
        apiErr.errors
          ? Object.values(apiErr.errors).flat().join('. ')
          : apiErr.message || 'Something went wrong. Please try again.'
      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass =
    'flex h-12 w-full rounded-xs border bg-white px-lg py-md text-body text-ink transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-form-focus disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden w-1/2 lg:block">
        <img
          src={registerImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center overflow-y-auto px-xl lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-xxl">
            <Link to="/" className="inline-block">
              <FiloLogo className="h-8" showIndicator={false} />
            </Link>
          </div>

          <h1 className="font-body text-card-heading text-ink">
            Create your account
          </h1>
          <p className="mt-md font-body text-body text-muted">
            Join Filo and start organizing your documents.
          </p>

          {serverError && (
            <div className="mt-xl rounded-xs border border-error bg-red-50 px-lg py-md">
              <p className="font-body text-body text-error">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-xxl space-y-xl">
            <div className="flex gap-xl">
              <div className="flex-1 space-y-sm">
                <label
                  htmlFor="firstName"
                  className="font-body text-caption text-ink"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className={cn(
                    fieldClass,
                    errors.firstName && 'border-error focus-visible:ring-error',
                  )}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="font-body text-micro text-error">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-sm">
                <label
                  htmlFor="lastName"
                  className="font-body text-caption text-ink"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className={cn(
                    fieldClass,
                    errors.lastName && 'border-error focus-visible:ring-error',
                  )}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="font-body text-micro text-error">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-sm">
              <label
                htmlFor="email"
                className="font-body text-caption text-ink"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn(
                  fieldClass,
                  errors.email && 'border-error focus-visible:ring-error',
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className="font-body text-micro text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-sm">
              <label
                htmlFor="password"
                className="font-body text-caption text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                className={cn(
                  fieldClass,
                  errors.password && 'border-error focus-visible:ring-error',
                )}
                {...register('password')}
              />
              {errors.password && (
                <p className="font-body text-micro text-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-pill bg-gray-200 text-gray-900 hover:bg-gray-300 font-body text-button"
            >
              {isSubmitting ? 'Creating account...' : 'Get Started'}
            </Button>
          </form>

          <p className="mt-xl text-center font-body text-body text-muted">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-ink underline underline-offset-2 hover:no-underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-lg text-center">
            <Link
              to="/"
              className="font-body text-body text-muted underline underline-offset-2 hover:text-ink"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
