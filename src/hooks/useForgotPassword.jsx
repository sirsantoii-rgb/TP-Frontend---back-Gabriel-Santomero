import { useState } from 'react'

const useForgotPassword = () => {
    const [form_state, setFormState] = useState({ email: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [response, setResponse] = useState(null)

    const onChangeFieldValue = (e) => {
        const { name, value } = e.target
        setFormState({ ...form_state, [name]: value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            const res = await fetch('https://tp-backend-utn-gabriel-santomero.vercel.app/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: form_state.email })
            })

            const data = await res.json()

            if (!data.ok) {
                
                setError(data)
            } else {
                
                setResponse(data)
            }
        } catch (err) {
            
            setError({ message: 'Error de conexión con el servidor' })
        } finally {
            setLoading(false)
        }
    }

    return {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    }
}

export default useForgotPassword