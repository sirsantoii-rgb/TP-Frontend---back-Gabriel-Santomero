import React, { useContext } from 'react'
import { Link } from 'react-router'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import './HomeScreen.css'

const HomeScreen = () => {
    // Asumimos que refetchWorkspaces es una función en tu context para recargar la lista
    const { 
        workspace_list_loading, 
        workspace_list_error, 
        workspace_list,
        refetchWorkspaces 
    } = useContext(WorkspaceContext)

    const handleDeleteWorkspace = async (e, workspaceId, title) => {
        e.preventDefault(); // Evita cualquier navegación accidental
        
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el espacio "${title}"? Esta acción no se puede deshacer.`);
        
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspaceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (data.ok) {
                alert("Espacio eliminado con éxito");
                // Si tienes la función en el context, úsala. Si no, recarga la página.
                if (refetchWorkspaces) {
                    refetchWorkspaces();
                } else {
                    window.location.reload();
                }
            } else {
                alert(data.message || "Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

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
                                    <div className="workspace-actions">
                                        <Link to={`/workspace/${workspace.workspace_id}`} className="btn-open">
                                            ABRIR
                                        </Link>
                                        <button 
                                            className="btn-delete-workspace"
                                            onClick={(e) => handleDeleteWorkspace(e, workspace.workspace_id, workspace.workspace_title)}
                                            title="Eliminar espacio"
                                        >
                                            🗑️
                                        </button>
                                    </div>
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

export default HomeScreen;