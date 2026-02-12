import React, { useContext } from 'react'
import { Link } from 'react-router'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import './HomeScreen.css'

const HomeScreen = () => {
    const { workspace_list_loading, workspace_list_error, workspace_list } = useContext(WorkspaceContext)

    if (workspace_list_loading || !workspace_list) {
        return (
            <div className="home-loading">
                <div className="spinner"></div>
                <span>Cargando tus espacios...</span>
            </div>
        )
    }

    const workspaces = workspace_list.data?.workspaces || []

    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="nav-left">
                    <span className="logo-icon">🚀</span>
                    <span className="logo-text">MiSlack</span>
                </div>
                <div className="nav-right">
                    <button className="nav-btn">🔔</button>
                    <div className="user-profile-circle">G</div>
                </div>
            </nav>

            <main className="home-main">
                <header className="home-header">
                    <h1>¡Hola de nuevo!</h1>
                    <p>Elige un espacio de trabajo para volver a comunicarte con tu equipo.</p>
                </header>

                <section className="workspace-section">
                    <div className="section-header">
                        <h2>Tus espacios de trabajo</h2>
                    </div>

                    <div className="workspace-list">
                        {workspace_list_error && (
                            <div className="error-card">{workspace_list_error.message}</div>
                        )}

                        {workspaces.length > 0 ? (
                            workspaces.map(workspace => (
                                <div key={workspace.workspace_id} className="workspace-item">
                                    <div className="workspace-info">
                                        <div className="workspace-avatar">
                                            {workspace.workspace_title.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="workspace-details">
                                            <h3>{workspace.workspace_title}</h3>
                                            <span>{workspace.members_count || 1} miembros</span>
                                        </div>
                                    </div>
                                    <Link to={`/workspace/${workspace.workspace_id}`} className="btn-open">
                                        ABRIR
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No pareces tener ningún espacio de trabajo aún.</p>
                            </div>
                        )}
                    </div>

                    <div className="create-workspace-footer">
                        <p>¿Deseas trabajar con un equipo nuevo?</p>
                        <Link to="/create-workspace" className="btn-secondary">
                            CREAR UN NUEVO ESPACIO DE TRABAJO
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default HomeScreen