'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'

const Page = () => {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    try {

      setLoading(true)

      const response = await fetch(
        'http://localhost:8080/api/admin/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      localStorage.setItem(
        'adminToken',
        data.token
      )

localStorage.setItem("adminToken", data.token);

      router.push('/Admin/Dashboard')

    } catch (error) {

      setError('Server Error')

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

      {/* Card */}
      <div className="w-full max-w-md relative z-10">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-500 flex items-center justify-center shadow-lg">

              <ShieldCheck
                size={40}
                className="text-white"
              />

            </div>

          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Panel
            </h1>

            <p className="text-gray-300 text-sm">
            </p>

          </div>

          {/* Error */}
          {
            error && (

              <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm rounded-xl p-3 mb-5">
                {error}
              </div>
            )
          }

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="text-gray-200 text-sm mb-2 block">
                Admin Email
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 transition-all"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="text-gray-200 text-sm mb-2 block">
                Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-orange-500 transition-all"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
                >

                  {
                    showPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }

                </button>

              </div>

            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-300">

                <input
                  type="checkbox"
                  className="accent-orange-500"
                />

                Remember me

              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-orange-300"
              >
                Forgot Password?
              </button>

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
            >

              {
                loading
                  ? 'Signing In...'
                  : 'Login '
              }

            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-400 text-sm">

            Secure Admin Access • RR Cafe

          </div>

        </div>

      </div>

    </div>
  )
}

export default Page