import React, { useState } from 'react';
import useWorkspace from '../../hooks/useWorkspace';
import './WorkspaceScreen.css';

const WorkspaceScreen = () => {
    const { 
        workspace, 
        channels, 
        loading, 
        error, 
        workspace_id 
    } = useWorkspace();

    const [activeChannelId, setActiveChannelId] = useState(null);
    const [messageText, setMessageText] = useState('');

    // Buscamos el objeto del canal activo para mostrar su nombre en el header
    const activeChannel = channels.find(c => c._id === activeChannelId);

    if (loading) return (
        <div className="workspace-loading">
            <div className="spinner"></div>
            <p>Cargando tu espacio de trabajo...</p>
        </div>
    );

    if (error) return <div className="workspace-error">⚠️ Error: {error.message}</div>;

    return (
        <div className="workspace-layout">
            {/* COLUMNA 1: SIDEBAR */}
            <aside className="sidebar">
                <header className="sidebar-header">
                    <button className="team-name-button">
                        {workspace?.title || 'Mi Equipo'} <span className="chevron">▼</span>
                    </button>
                    <button className="new-message-btn" title="Nuevo mensaje">📝</button>
                </header>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <div className="section-title">
                            <span>▼ Canales</span>
                            <button className="add-btn" title="Crear canal">+</button>
                        </div>
                        <ul className="channel-list">
                            {channels.length > 0 ? (
                                channels.map(channel => (
                                    <li 
                                        key={channel._id} 
                                        className={`channel-item ${activeChannelId === channel._id ? 'active' : ''}`}
                                        onClick={() => setActiveChannelId(channel._id)}
                                    >
                                        <span className="hashtag">#</span> {channel.name}
                                    </li>
                                ))
                            ) : (
                                <li className="no-data">No hay canales aún</li>
                            )}
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <div className="section-title">
                            <span>▼ Mensajes directos</span>
                            <button className="add-btn">+</button>
                        </div>
                        <ul className="dm-list">
                            <li className="dm-item">
                                <span className="status-online"></span> Gabriel (tú)
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* COLUMNA 2: ÁREA DE CHAT */}
            <main className="chat-container">
                {activeChannelId ? (
                    <>
                        <header className="chat-header">
                            <div className="header-info">
                                <h2><span className="hashtag">#</span> {activeChannel?.name} <span>⭐</span></h2>
                            </div>
                            <div className="header-actions">
                                <button className="invite-btn">👤 Añadir gente</button>
                            </div>
                        </header>

                        <section className="messages-display">
                            {/* Placeholder de mensajes - Aquí conectaremos useMessages después */}
                            <div className="message-item-welcome">
                                <h3>¡Te damos la bienvenida al canal #{activeChannel?.name}!</h3>
                                <p>Este es el principio de la historia de este canal.</p>
                            </div>
                            
                            {/* Ejemplo de un mensaje estático */}
                            <div className="message-item">
                                <div className="user-avatar">G</div>
                                <div className="message-content">
                                    <span className="user-name">Gabriel <small>10:45 AM</small></span>
                                    <p>¡Hola equipo! Ya tenemos funcionando la estructura del workspace. 🚀</p>
                                </div>
                            </div>
                        </section>

                        <footer className="message-input-area">
                            <div className="input-wrapper">
                                <textarea 
                                    placeholder={`Enviar un mensaje a #${activeChannel?.name}`} 
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                />
                                <div className="input-toolbar">
                                    <button 
                                        className={`send-btn ${messageText.trim() ? 'active' : ''}`}
                                        disabled={!messageText.trim()}
                                    >
                                        ➡️
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <div className="welcome-hero">
                            <span className="hero-icon">💬</span>
                            <h2>Bienvenido a {workspace?.title}</h2>
                            <p>Selecciona un canal en la barra lateral para empezar a chatear con tu equipo.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WorkspaceScreen;