import React, { useState, useEffect } from 'react';
import useWorkspace from '../../hooks/useWorkspace';
import CreateChannelModal from './CreateChannelModal'; 
import ChannelItem from './ChannelItem';
import MessageItem from './MessageItem';
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
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isChannelsVisible, setIsChannelsVisible] = useState(true);
    
    // Estado para el sidebar en móvil
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [loadingInvite, setLoadingInvite] = useState(false);

    const activeChannel = channels.find(c => c._id === activeChannelId);

    useEffect(() => {
        if (activeChannelId) {
            fetchMessages();
        }
    }, [activeChannelId]);

    const fetchMessages = async () => {
        if (!workspace_id || !activeChannelId) return;
        setLoadingMessages(true);
        try {
            const response = await fetch(
                `https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels/${activeChannelId}/messages`, 
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }
            );
            const data = await response.json();
            if (data.ok) setMessages(data.data.messages);
        } catch (err) {
            console.error("Error al obtener mensajes:", err);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        setLoadingInvite(true);
        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });
            const data = await response.json();
            if (data.ok) {
                alert("Invitación enviada con éxito a " + inviteEmail);
                setIsInviteModalOpen(false);
                setInviteEmail('');
            } else {
                alert(data.message || "Error al invitar");
            }
        } catch (err) {
            alert("Error de conexión");
        } finally {
            setLoadingInvite(false);
        }
    };

    const handleChannelCreated = (newChannel) => {
        refetchChannels(); 
        if (newChannel?._id) setActiveChannelId(newChannel._id); 
    };

    const handleDeleteChannel = async (channel) => {
        if (!window.confirm(`¿Seguro que quieres eliminar #${channel.name}?`)) return;
        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels/${channel._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            if ((await response.json()).ok) {
                refetchChannels();
                if (activeChannelId === channel._id) setActiveChannelId(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleRenameChannel = async (channel) => {
        const newName = window.prompt("Nuevo nombre:", channel.name);
        if (!newName || newName === channel.name) return;
        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels/${channel._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
                },
                body: JSON.stringify({ name: newName })
            });
            if ((await response.json()).ok) refetchChannels();
        } catch (err) { console.error(err); }
    };

    const handleInfoChannel = (channel) => {
        alert(`Canal: #${channel.name}\nID: ${channel._id}`);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!messageText.trim() || !activeChannelId) return;
        const textToSend = messageText;
        setMessageText(''); 
        try {
            const response = await fetch(
                `https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels/${activeChannelId}/messages`, 
                {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
                    },
                    body: JSON.stringify({ content: textToSend }) 
                }
            );
            const data = await response.json();
            if (data.ok) fetchMessages(); 
        } catch (err) { console.error("Error en la petición POST:", err); }
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
            {/* El sidebar usa la clase mobile-open para mostrarse en móvil */}
            <aside className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                <header className="sidebar-header">
                    <button className="team-name-button">{workspace?.title || 'Mi Equipo'}</button>
                    <button className="close-mobile-btn" onClick={() => setIsMobileSidebarOpen(false)}>✕</button>
                    <button className="new-message-btn" title="Nuevo mensaje">📝</button>
                </header>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <div className="section-title">
                            <button className="toggle-section-btn" onClick={() => setIsChannelsVisible(!isChannelsVisible)}>
                                <span className={`arrow ${isChannelsVisible ? 'open' : ''}`}>▶</span> 
                                <span>Canales</span>
                            </button>
                            <button className="add-btn" onClick={() => setIsModalOpen(true)}>+</button>
                        </div>
                        {isChannelsVisible && (
                            <ul className="channel-list">
                                {channels.length > 0 ? channels.map(channel => (
                                    <ChannelItem 
                                        key={channel._id}
                                        channel={channel}
                                        isActive={activeChannelId === channel._id}
                                        onSelect={(id) => {
                                            setActiveChannelId(id);
                                            setIsMobileSidebarOpen(false); // Cierra al seleccionar canal
                                        }}
                                        onDelete={handleDeleteChannel}
                                        onRename={handleRenameChannel}
                                        onInfo={handleInfoChannel}
                                    />
                                )) : <li className="no-data">No hay canales aún</li>}
                            </ul>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Overlay para cerrar sidebar al hacer clic fuera */}
            {isMobileSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>}

            <main className="chat-container">
                <header className="chat-header">
                    <div className="header-left">
                        {/* Botón hamburguesa visible solo en móvil */}
                        <button className="mobile-menu-btn" onClick={() => setIsMobileSidebarOpen(true)}>☰</button>
                        <h2><span className="hashtag">#</span> {activeChannel?.name || "Selecciona un canal"}</h2>
                    </div>
                    <div className="header-right">
                        <button className="btn-invite-header" onClick={() => setIsInviteModalOpen(true)}>👤+ Invitar</button>
                        {activeChannelId && (
                            <>
                                <button className="header-opt-btn" onClick={() => handleRenameChannel(activeChannel)}>✏️</button>
                                <button className="header-opt-btn delete" onClick={() => handleDeleteChannel(activeChannel)}>🗑️</button>
                            </>
                        )}
                    </div>
                </header>
                
                <section className="messages-display">
                    {activeChannelId ? (
                        loadingMessages ? <div className="messages-loading">Cargando...</div> :
                        messages.length > 0 ? messages.map(msg => <MessageItem key={msg._id} message={msg} />) :
                        <div className="message-item-welcome"><h3>¡Bienvenido a #{activeChannel?.name}!</h3></div>
                    ) : (
                        <div className="no-channel-selected"><h2>Selecciona un canal</h2></div>
                    )}
                </section>

                {activeChannelId && (
                    <footer className="message-input-area">
                        <div className="input-wrapper">
                            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} />
                            <div className="input-toolbar">
                                <button className={`send-btn ${messageText.trim() ? 'active' : ''}`} onClick={handleSendMessage}>➡️</button>
                            </div>
                        </div>
                    </footer>
                )}
            </main>

            {/* Modales... (omitidos por brevedad, usa los que ya tenías) */}
        </div>
    );
};

export default WorkspaceScreen;