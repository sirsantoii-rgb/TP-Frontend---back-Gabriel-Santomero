import React from 'react'
import { Link } from 'react-router'
import useRegister from '../../hooks/useRegister'
import './RegisterScreen.css' // Importamos el CSS

const RegisterScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useRegister()

    return (
        <div className="register-container">
            <header className="register-header">
                <div className="app-logo">
                    <img src="../../imagenes/logo.svg" alt="logo" />
                </div>
                <h1>Crea tu cuenta</h1>
                <p className="subtitle">Únete a tu equipo y empieza a colaborar hoy mismo.</p>
            </header>

            <main className="register-main">
                <form className="register-form" onSubmit={onSubmitForm}>
                    <div className="input-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Tu apodo o nombre"
                            value={form_state.username}
                            onChange={onChangeFieldValue}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="nombre@email.com"
                            value={form_state.email}
                            onChange={onChangeFieldValue}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Crea una contraseña segura"
                            value={form_state.password}
                            onChange={onChangeFieldValue}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error.message}</div>}
                    
                    {response?.ok && (
                        <div className="success-message">
                            Usuario registrado exitosamente. <strong>Revisa tu correo</strong> para verificar tu cuenta.
                        </div>
                    )}

                    <button 
                        className="btn-primary" 
                        type="submit" 
                        disabled={loading || response?.ok}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>Al registrarte, aceptas nuestros <strong>Términos y Condiciones</strong>.</p>
                    <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </main>
        </div>
    )
}

export default RegisterScreen