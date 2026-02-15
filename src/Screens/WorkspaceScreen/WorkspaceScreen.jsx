import React, { useState } from 'react';
import useWorkspace from '../../hooks/useWorkspace';
import CreateChannelModal from './CreateChannelModal'; 
import ChannelItem from './ChannelItem'; // Importamos el subcomponente
import './WorkspaceScreen.css';

const WorkspaceScreen = () => {
    const { 
        workspace, 
        channels, 
        loading, 
        error, 
        workspace_id,
        refetchChannels 
    } = useWorkspace();

    const [activeChannelId, setActiveChannelId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeChannel = channels.find(c => c._id === activeChannelId);

    // --- MANEJADORES DE EVENTOS DE CANAL ---

    const handleChannelCreated = (newChannel) => {
        refetchChannels(); 
        if (newChannel?._id) setActiveChannelId(newChannel._id); 
    };

    const handleDeleteChannel = async (channel) => {
        if (!window.confirm(`¿Seguro que quieres eliminar #${channel.name}?`)) return;
        
        try {
            const response = await fetch(`https://tu-backend.vercel.app/api/workspace/${workspace_id}/channels/${channel_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (data.ok) {
                refetchChannels();
                if (activeChannelId === channel._id) setActiveChannelId(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleRenameChannel = async (channel) => {
        const newName = window.prompt("Nuevo nombre:", channel.name);
        if (!newName || newName === channel.name) return;

        try {
            const response = await fetch(`https://tu-backend.vercel.app/api/workspace/${workspace_id}/channels/${channel_id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({ name: newName })
            });
            const data = await response.json();
            if (data.ok) refetchChannels();
        } catch (err) { console.error(err); }
    };

    const handleInfoChannel = (channel) => {
        alert(`Canal: #${channel.name}\nCreado: ${new Date(channel.created_at).toLocaleDateString()}`);
    };

    // --- MENSAJES ---

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!messageText.trim()) return;
        console.log(`Enviando a #${activeChannel?.name}:`, messageText);
        setMessageText(''); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) return <div className="workspace-loading"><div className="spinner"></div><p>Cargando...</p></div>;
    if (error) return <div className="workspace-error">⚠️ Error: {error.message}</div>;

    return (
        <div className="workspace-layout">
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
                            <button className="add-btn" onClick={() => setIsModalOpen(true)}>+</button>
                        </div>
                        <ul className="channel-list">
                            {channels.length > 0 ? (
                                channels.map(channel => (
                                    <ChannelItem 
                                        key={channel._id}
                                        channel={channel}
                                        isActive={activeChannelId === channel._id}
                                        onSelect={setActiveChannelId}
                                        onDelete={handleDeleteChannel}
                                        onRename={handleRenameChannel}
                                        onInfo={handleInfoChannel}
                                    />
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
                            <li className="dm-item"><span className="status-online"></span> Gabriel (tú)</li>
                        </ul>
                    </div>
                </nav>
            </aside>

            <main className="chat-container">
                {activeChannelId ? (
                    <>
                        <header className="chat-header">
                            <h2><span className="hashtag">#</span> {activeChannel?.name} <span>⭐</span></h2>
                            <button className="invite-btn">👤 Añadir gente</button>
                        </header>
                        <section className="messages-display">
                            <div className="message-item-welcome">
                                <h3>¡Bienvenido a #{activeChannel?.name}!</h3>
                                <p>Este es el inicio del canal.</p>
                            </div>
                        </section>
                        <footer className="message-input-area">
                            <div className="input-wrapper">
                                <textarea 
                                    placeholder={`Enviar mensaje a #${activeChannel?.name}`} 
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="input-toolbar">
                                    <button className={`send-btn ${messageText.trim() ? 'active' : ''}`} onClick={handleSendMessage}>➡️</button>
                                </div>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <div className="welcome-hero">
                            <span className="hero-icon">💬</span>
                            <h2>Bienvenido a {workspace?.title}</h2>
                            <p>Selecciona un canal para comenzar.</p>
                        </div>
                    </div>
                )}
            </main>

            <CreateChannelModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onCreate={handleChannelCreated}
                workspaceId={workspace_id}
            />
        </div>
    );
};

export default WorkspaceScreen;