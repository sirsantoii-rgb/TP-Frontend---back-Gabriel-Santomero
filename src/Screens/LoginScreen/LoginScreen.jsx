import React from 'react'
import { Link } from 'react-router'
import useLogin from '../../hooks/useLogin'
import './LoginScreen.css' 

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
                
                <div className="app-logo">
                    <img src="/images/logo.svg" alt="logo" />
                    
                    <p class="logo-text" style={{color: '#454245', fontSize: '20px', fontWeight: 'normal'}}>cafeWork es tu espacio de trabajo digital: un lugar donde conversar, compartir ideas y coordinar proyectos como si estuvieras en tu cafetería favorita, pero con todas las funciones que tu equipo necesita.</p>
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