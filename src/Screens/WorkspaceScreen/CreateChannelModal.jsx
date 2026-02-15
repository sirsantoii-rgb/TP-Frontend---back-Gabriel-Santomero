import React, { useState } from 'react';
import './CreateChannelModal.css';

const CreateChannelModal = ({ isOpen, onClose, onCreate, workspaceId }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspaceId}/channels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: name.trim() })
            });

            const data = await response.json();

            if (data.ok) {
                // Notificamos al padre y limpiamos
                onCreate(data.data.channel_created);
                setName('');
                onClose();
            } else {
                alert(data.message || "Error al crear el canal");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Crear un canal</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>
                <p className="modal-description">
                    Los canales son donde tu equipo se comunica. Son mejores cuando se organizan en torno a un tema (ej: #proyectos).
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="channel-name">Nombre</label>
                        <div className="input-wrapper-modal">
                            <span className="hash-prefix">#</span>
                            <input
                                id="channel-name"
                                type="text"
                                placeholder="ej. plan-de-marketing"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create" 
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;