import React from 'react'
import { Link } from 'react-router'
import useForgotPassword from '../../hooks/useForgotPassword'
import './ForgotPasswordScreen.css'

const ForgotPasswordScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useForgotPassword()

    return (
        <div className="forgot-container">
            <header className="forgot-header">
                <div className="app-logo">
                    <img src="/images/logo.svg" alt="logo" />
                </div>
                <h1>Restablecer contraseña</h1>
                <p className="subtitle">
                    Introduce tu <strong>email</strong> y te enviaremos un enlace para que vuelvas a entrar a tu cuenta.
                </p>
            </header>

            <main className="forgot-main">
                <form className="forgot-form" onSubmit={onSubmitForm}>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email" // Importante: el name debe coincidir con el estado del hook
                            placeholder="nombre@email.com"
                            value={form_state.email}
                            onChange={onChangeFieldValue}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-box">
                            {error.message}
                        </div>
                    )}

                    {response?.ok && (
                        <div className="success-box">
                            ¡Enlace enviado! Revisa tu bandeja de entrada.
                        </div>
                    )}

                    <button 
                        className="btn-primary" 
                        type="submit" 
                        disabled={loading || response?.ok}
                    >
                        {loading ? 'Enviando...' : 'Obtener enlace de restablecimiento'}
                    </button>
                </form>

                <div className="forgot-footer">
                    <p>¿Recordaste tu contraseña? <Link to="/login">Volver al inicio</Link></p>
                </div>
            </main>
        </div>
    )
}

export default ForgotPasswordScreen