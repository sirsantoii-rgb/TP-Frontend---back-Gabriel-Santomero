import React, { useState, useRef, useEffect } from 'react';

const ChannelHeader = ({ activeChannel, onDelete, onRename, onInfo }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="chat-header">
            <div className="header-info">
                <h2><span className="hashtag">#</span> {activeChannel?.name}</h2>
            </div>

            <div className="header-actions" ref={menuRef}>
                <button 
                    className="menu-dots-header" 
                    onClick={() => setShowMenu(!showMenu)}
                >
                    ⋮
                </button>

                {showMenu && (
                    <div className="dropdown-menu header-dropdown">
                        <button onClick={() => { onRename(activeChannel); setShowMenu(false); }}>
                            ✏️ Renombrar canal
                        </button>
                        <button onClick={() => { onInfo(activeChannel); setShowMenu(false); }}>
                            ℹ️ Información
                        </button>
                        <hr />
                        <button className="delete-opt" onClick={() => { onDelete(activeChannel); setShowMenu(false); }}>
                            🗑️ Eliminar canal
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default ChannelHeader;