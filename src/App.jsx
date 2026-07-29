import { useEffect, useState } from "react";
import { supabase } from './lib/SupabaseClient'
import AuthForm from './components/AuthForm.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Start from './pages/Start.jsx'

export default function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('landing')

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                setView('dashboard')
            } else {
                setView('landing')
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div>
                <div className="loader" />
            </div>
        )
    }

    if (!session && view === 'landing') {
        return <Start onGetStarted={() => setView('auth')} />
    }

    if (!session && view === 'auth') {
        return (
            <div>
                <AuthForm onBackToLanding={() => setView('landing')} />
            </div>
        )
    }

    return (
        <div>
            <Dashboard session={session} />
        </div>
    )
}