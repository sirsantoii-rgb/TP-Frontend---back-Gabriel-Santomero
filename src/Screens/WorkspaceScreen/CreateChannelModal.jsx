import React, { useState } from 'react';
import './CreateChannelModal.css';

const CreateChannelModal = ({ isOpen, onClose, onCreate, workspaceId }) => {
    const [channelName, setChannelName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspaces/${workspaceId}/channels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: channelName })
            });

            const data = await response.json();
            if (data.ok) {
                onCreate(data.data.channel_created); // Notificamos al padre
                setChannelName('');
                onClose();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error al crear canal:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h2>Crear un canal</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>
                <p className="modal-subtitle">Los canales son el lugar donde los miembros se comunican.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <div className="input-prefix">
                            <span className="hashtag">#</span>
                            <input 
                                type="text" 
                                placeholder="ej. plan-de-marketing" 
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <footer className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit" disabled={loading || !channelName}>
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;