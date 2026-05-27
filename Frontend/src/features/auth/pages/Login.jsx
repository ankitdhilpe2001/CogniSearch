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
    <div className="min-h-screen flex items-center justify-center bg-[#07122a] px-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-md rounded-2xl bg-[#101b33] p-10 border border-[#2f3952]/30 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Cogni<span className="text-blue-500">Search</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Enter your credentials to access your threads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
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
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-[#2f3952] bg-[#07122a] px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Password
              </label>
              <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-[#2f3952] bg-[#07122a] px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#101b33] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? 'Signing in...' : 'Sign in to CogniSearch'}
            </span>
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-white hover:text-blue-400 transition-colors">
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
