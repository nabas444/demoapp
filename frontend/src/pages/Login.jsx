import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Signing in…' })
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || data?.error || 'Login failed')

      setStatus({ type: 'success', message: data.message || 'Login successful' })
      setForm({ email: '', password: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '280px' }}
      >
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {status.message && (
        <p
          style={{
            marginTop: '1rem',
            color: status.type === 'error' ? '#ff8c8c' : '#8cf5c3',
          }}
        >
          {status.message}
        </p>
      )}
    </main>
  )
}
