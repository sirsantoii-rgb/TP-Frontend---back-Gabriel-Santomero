import React from 'react'
import { Link } from 'react-router'
import useLogin from '../../hooks/useLogin'
import './LoginScreen.css' // Importamos el CSS

const LoginScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useLogin()

    return (
        <div className="login-container">
            <header className="login-header">
                {/* Puedes reemplazar este div con una etiqueta img si tienes el logo de tu app */}
                <div className="app-logo">
                    <span className="logo-icon">🚀</span>
                    <span className="logo-text">MiSlack</span>
                </div>
                <h1>Primero, introduce tu email</h1>
                <p className="subtitle">Sugerimos usar la <strong>dirección de correo que usas en el trabajo.</strong></p>
            </header>

            <main className="login-main">
                <form className="login-form" onSubmit={onSubmitForm}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="nombre@email.com"
                            onChange={onChangeFieldValue} 
                            value={form_state.email} 
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Tu contraseña"
                            onChange={onChangeFieldValue} 
                            value={form_state.password} 
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error.message}</div>}
                    
                    {response?.ok && (
                        <div className="success-message">Te has logueado exitosamente</div>
                    )}

                    <button 
                        className="btn-primary" 
                        type="submit" 
                        disabled={loading || response?.ok}
                    >
                        {loading ? 'Cargando...' : 'Continuar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupérala aquí</Link></p>
                    <p>¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link></p>
                </div>
            </main>
        </div>
    )
}

export default LoginScreen