import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'

const Register = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const { user, handleRegister, loading, error } = useAuth()
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await handleRegister({ username, email, password })
      navigate('/', {
        replace: true,
        state: {
          message:
            data?.message ??
            'Account created. Verify your email, then sign in.',
        },
      })
    } catch {
      // error is stored in Redux by useAuth
    }
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
          Cogni<span className="text-accent">Search</span>
        </h1>
        <p className="text-sm text-secondary">
          Join the next-gen intelligence portal
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-surface p-10 border border-outline shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
            >
              Username
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <i className="ri-user-line text-[18px]" aria-hidden="true" />
              </span>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                className="w-full rounded-xl border border-surface-bright bg-background pl-11 pr-4 py-3 text-foreground placeholder:text-placeholder outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
            >
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <i className="ri-mail-line text-[18px]" aria-hidden="true" />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-surface-bright bg-background pl-11 pr-4 py-3 text-foreground placeholder:text-placeholder outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
            >
              Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <i className="ri-lock-line text-[18px]" aria-hidden="true" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-surface-bright bg-background pl-11 pr-12 py-3 text-foreground placeholder:text-placeholder outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-placeholder hover:text-secondary transition-colors"
              >
                {showPassword ? (
                  <i className="ri-eye-off-line text-[18px]" aria-hidden="true" />
                ) : (
                  <i className="ri-eye-line text-[18px]" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent-hover py-3.5 text-sm font-bold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && (
              <i className="ri-arrow-right-line text-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline pt-6">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-foreground hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
