import React from 'react';
import { Link } from 'react-router';
import useCreateWorkspace from '../../hooks/useCreateWorkspace';
import './CreateWorkspaceScreen.css';

const CreateWorkspaceScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        isLoading,
        error,
        errors
    } = useCreateWorkspace();

    return (
        <div className="create-workspace-container">
            <header className="create-header-nav">
                <div className="app-logo">
                    <span className="logo-icon">🚀</span>
                    <span className="logo-text">MiSlack</span>
                </div>
            </header>

            <main className="create-workspace-main">
                <header className="create-workspace-header">
                    <h1>¿Cómo se llama tu equipo?</h1>
                    <p className="subtitle">
                        Este será el nombre de tu espacio de trabajo de MiSlack. Elige algo que tu equipo reconozca.
                    </p>
                </header>

                <form className="workspace-form" onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Nombre del espacio de trabajo</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-input"
                            placeholder="Ej. Marketing, Ventas, Proyecto Final"
                            value={form_state.title}
                            onChange={onChangeFieldValue}
                            disabled={isLoading}
                        />
                        {errors.title && <span className="error-message">⚠️ {errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Descripción (opcional)</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-textarea"
                            placeholder="¿En qué está trabajando tu equipo?"
                            value={form_state.description}
                            onChange={onChangeFieldValue}
                            disabled={isLoading}
                        />
                        <div className={`char-counter ${form_state.description.length > 900 ? 'limit-near' : ''} ${form_state.description.length >= 1000 ? 'limit-reached' : ''}`}>
                            {form_state.description.length} / 1000
                        </div>
                        {errors.description && <span className="error-message">⚠️ {errors.description}</span>}
                    </div>

                    {error && <div className="error-box">Error al crear el workspace: {error.message}</div>}

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={form_state.description.length > 1000 || isLoading}
                    >
                        {isLoading ? 'Creando...' : 'Crear espacio de trabajo'}
                    </button>
                </form>

                <div className="back-link">
                    <Link to="/home">Volver atrás</Link>
                </div>
            </main>
        </div>
    );
};

export default CreateWorkspaceScreen;