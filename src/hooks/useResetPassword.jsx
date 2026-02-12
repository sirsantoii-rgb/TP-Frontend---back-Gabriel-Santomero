import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'

const useResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    // Obtenemos el token que viene en la URL (?token=...)
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const onSubmitForm = async (e) => {
        e.preventDefault()
        
        if (!token) {
            setError({ message: 'El token de recuperación no es válido o ha expirado.' })
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await fetch('https://tp-backend-utn-gabriel-santomero.vercel.app/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    token: token, 
                    password: password 
                })
            })

            const data = await res.json()

            if (!data.ok) {
                setError(data)
            } else {
                setSuccess(true)
                // Esperamos 3 segundos para que el usuario lea el mensaje de éxito y redirigimos
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
        } catch (err) {
            setError({ message: 'Error de conexión con el servidor' })
        } finally {
            setLoading(false)
        }
    }

    return {
        setPassword,
        onSubmitForm,
        loading,
        error,
        success,
        token
    }
}

export default useResetPassword