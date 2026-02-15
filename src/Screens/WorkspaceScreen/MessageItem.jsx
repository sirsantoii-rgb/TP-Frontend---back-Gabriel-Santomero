import React from 'react';

const MessageItem = ({ message }) => {
    // Extraemos los datos gracias al populate del backend
    const user = message.fk_workspace_member_id?.fk_id_user;
    const username = user?.username || user?.email || "Usuario";
    const initial = username.charAt(0).toUpperCase();
    
    // Formatear la fecha/hora
    const date = new Date(message.created_at);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="message-item">
            <div className="user-avatar">
                {initial}
            </div>
            <div className="message-content">
                <div className="message-header">
                    <span className="user-name">{username}</span>
                    <small className="message-time">{timeString}</small>
                </div>
                <p className="message-text">{message.mensaje}</p>
            </div>
        </div>
    );
};

export default MessageItem;