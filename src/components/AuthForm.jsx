import { useState } from "react";
import { supabase } from "../lib/SupabaseClient";

export default function AuthForm({ onBackToLanding }) {
    const [mode, setMode] = useState('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const isSignUp = mode === 'signup'

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage(null)
        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                setMessage({
                    type: 'success',
                    text: 'Account created. Check your email to confirm it.'
                })
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong.' })
        } finally {
            setLoading(false)
        }
    }

    async function handleMagicLink() {
        if (!email) {
            setMessage({ type: 'error', text: 'Enter your email first, then tap magic link.' })
            return
        }

        setMessage(null)
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })
        setLoading(false)
        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Magic link sent. Check your inbox.' })
        }
    }

    return (
        <div className="auth-shell">
            {onBackToLanding && (
                <button type="button" className="link-btn auth-back" onClick={onBackToLanding}>
                    ← Back to overview
                </button>
            )}

            <div className="card">
                <div className="card-eyebrow">Supabase Auth</div>
                <h1 className="card-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
                <p className="card-subtitle">
                    {isSignUp
                        ? 'Sign up with an email and password to get started.'
                        : 'Sign in to continue to your dashboard.'}
                </p>

                <form onSubmit={handleSubmit} className="form">
                    <label className="field">
                        <span>Email</span>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="field">
                        <span>Password</span>
                        <input
                            type="password"
                            required
                            minLength={6}
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </label>

                    {message && (
                        <div className={`alert alert-${message.type}`} role="status">
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
                    </button>

                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={handleMagicLink}
                        disabled={loading}
                    >
                        Email me a magic link instead
                    </button>
                </form>

                <div className="card-footer">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => {
                            setMode(isSignUp ? 'signin' : 'signup')
                            setMessage(null)
                        }}
                    >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    )
}