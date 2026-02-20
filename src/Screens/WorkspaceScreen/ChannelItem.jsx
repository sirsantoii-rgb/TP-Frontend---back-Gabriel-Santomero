import React, { useState, useRef, useEffect } from 'react';

const ChannelItem = ({ channel, isActive, onSelect, onDelete, onRename, onInfo }) => {
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
        <li 
            className={`channel-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(channel._id)}
        >
            <div className="channel-label">
                <span className="hashtag">#</span> {channel.name}
            </div>

            <div className="menu-container" ref={menuRef}>
                <button 
                    className="menu-dots" 
                    onClick={(e) => {
                        e.stopPropagation(); // No cambia de canal al abrir el menú
                        setShowMenu(!showMenu);
                    }}
                >
                    ⋮
                </button>

                {showMenu && (
                    <div className="dropdown-menu">
                        <button onClick={(e) => { e.stopPropagation(); onRename(channel); setShowMenu(false); }}>
                            ✏️ Renombrar
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onInfo(channel); setShowMenu(false); }}>
                            ℹ️ Info
                        </button>
                        <hr />
                        <button className="delete-opt" onClick={(e) => { e.stopPropagation(); onDelete(channel); setShowMenu(false); }}>
                            🗑️ Eliminar
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
};

export default ChannelItem;