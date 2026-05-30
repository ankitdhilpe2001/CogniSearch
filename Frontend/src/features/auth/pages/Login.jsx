import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'

const Login = () => {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const { handleLogin, loading, error } = useAuth()

  const navigate = useNavigate()

  const location = useLocation()
  
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleLogin({ email, password })
      navigate('/dashboard', { replace: true })
    } catch {
      // error is stored in Redux by useAuth
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-10 border border-outline shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Cogni<span className="text-accent">Search</span>
          </h2>
          <p className="mt-3 text-sm text-secondary">
            Enter your credentials to access your threads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

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
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Password
              </label>
              <a href="#" className="text-xs font-medium text-accent hover:text-accent/80 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <i className="ri-lock-line text-[18px]" aria-hidden="true" />
              </span>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-surface-bright bg-background pl-11 pr-4 py-3 text-foreground placeholder:text-placeholder outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-accent-hover py-3.5 text-sm font-bold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign in to CogniSearch'}
              {!loading && (
                <i className="ri-arrow-right-line text-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              )}
            </span>
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-foreground hover:text-accent transition-colors">
                Create one for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
