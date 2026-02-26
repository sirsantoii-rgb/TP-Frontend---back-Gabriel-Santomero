import React, { useState } from 'react';
import './CreateChannelModal.css';

// IMPORTANTE: Los nombres aquí DEBEN coincidir con los que pasas desde WorkspaceScreen
const CreateChannelModal = ({ isOpen, onClose, onChannelCreated, workspace_id }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Verificación de seguridad: si no hay ID, no disparamos
        if (!workspace_id) {
            alert("Error: No se encontró el ID del espacio de trabajo.");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('auth_token');
        
        // La URL exacta que me pediste
        const url = `https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels`;
        
        console.log("Disparando POST a:", url); // Revisa esto en F12

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: name.trim() })
            });

            const data = await response.json();

            if (data.ok) {
                // Ajustamos la lectura según la estructura común de tu API
                // Si el objeto viene dentro de data.channel_created, lo pasamos
                const newChannel = data.data?.channel_created || data.data;
                onChannelCreated(newChannel);
                setName('');
                onClose();
            } else {
                // Si el servidor responde pero con ok: false
                alert(`Error del servidor: ${data.message || 'No se pudo crear'}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión: Verifica tu internet o el estado del servidor.");
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
                    Los canales son donde tu equipo se comunica.
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