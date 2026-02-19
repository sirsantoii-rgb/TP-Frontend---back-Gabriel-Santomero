import React from 'react'
import { Link } from 'react-router'
import useResetPassword from '../../hooks/useResetPassword'
import './ResetPasswordScreen.css'

const ResetPasswordScreen = () => {
    const { 
        setPassword, 
        onSubmitForm, 
        loading, 
        error, 
        success, 
        token 
    } = useResetPassword()

    // Si no hay token en la URL, mostramos un error preventivo
    if (!token) {
        return (
            <div className="reset-container">
                <div className="error-box">
                    Token inválido o ausente. Por favor, solicita un nuevo enlace.
                    <br />
                    <Link to="/forgot-password">Ir a recuperar contraseña</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="reset-container">
            <header className="reset-header">
                <div className="app-logo">
                    <img src="/images/logo.svg" alt="logo" />
                </div>
                <h1>Elige una nueva contraseña</h1>
                <p className="subtitle">
                    Asegúrate de que sea una contraseña que no uses en otros sitios.
                </p>
            </header>

            <main className="reset-main">
                {success ? (
                    <div className="success-box">
                        <h2>¡Contraseña actualizada!</h2>
                        <p>Tu contraseña ha sido cambiada correctamente. Te estamos redirigiendo al inicio de sesión...</p>
                    </div>
                ) : (
                    <form className="reset-form" onSubmit={onSubmitForm}>
                        <div className="input-group">
                            <label htmlFor="password">Nueva contraseña</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Mínimo 6 caracteres"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="error-box">{error.message}</div>}

                        <button 
                            className="btn-primary" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                )}
            </main>
        </div>
    )
}

export default ResetPasswordScreen