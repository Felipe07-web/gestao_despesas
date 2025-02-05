import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    // ✅ Configuração do SWR para buscar o usuário autenticado
    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios.get('/api/user', { withCredentials: true }) // 🔥 Garante que cookies sejam enviados
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status !== 409) throw error
                router.push('/verify-email')
            }),
    )

    // ✅ Garante que a autenticação CSRF seja feita antes de enviar credenciais
    const csrf = () => axios.get('/sanctum/csrf-cookie', { withCredentials: true })

    // ✅ Função de Registro de Usuário
    const register = async ({ setErrors, ...props }) => {
        await csrf()
        setErrors([])

        axios.post('/register', props, { withCredentials: true })
            .then(() => mutate())
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    // ✅ Função de Login
    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios.post('/login', props, { withCredentials: true })
            .then(() => mutate())
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    // ✅ Esqueci minha senha
    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios.post('/forgot-password', { email }, { withCredentials: true })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    // ✅ Resetar senha
    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios.post('/reset-password', props, { withCredentials: true })
            .then(response => router.push('/login?reset=' + btoa(response.data.status)))
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    // ✅ Reenviar verificação de email
    const resendEmailVerification = async ({ setStatus }) => {
        axios.post('/email/verification-notification', {}, { withCredentials: true })
            .then(response => setStatus(response.data.status))
    }

    // ✅ Logout
    const logout = async () => {
        if (!error) {
            await axios.post('/logout', {}, { withCredentials: true }).then(() => mutate())
        }
        window.location.pathname = '/login'
    }

    // ✅ Gerenciamento de Redirecionamento no `useEffect`
    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        // 🔥 Removendo a verificação de email para evitar bloqueios
        // if (middleware === 'auth' && !user?.email_verified_at)
        //     router.push('/verify-email')

        if (window.location.pathname === '/verify-email' && user?.email_verified_at)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
