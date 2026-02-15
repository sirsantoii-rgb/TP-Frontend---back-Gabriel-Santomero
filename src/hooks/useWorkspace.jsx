import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

const useWorkspace = () => {
    const { workspace_id } = useParams() // Captura el ID de la URL
    const [channels, setChannels] = useState([])
    const [workspace, setWorkspace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getWorkspaceData = async () => {
        setLoading(true)
        const token = localStorage.getItem('token') // Asumiendo que guardas el JWT aquí

        try {
            // 1. Traer datos del Workspace (nombre, etc)
            // Usamos tu ruta: GET /api/workspaces/:workspace_id
            const workspaceRes = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const workspaceData = await workspaceRes.json()

            // 2. Traer canales del Workspace
            // Usamos tu ruta: GET /api/workspaces/:workspace_id/channels
            const channelsRes = await fetch(`https://tp-backend-utn-gabriel-santomero.vercel.app/api/workspace/${workspace_id}/channels`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const channelsData = await channelsRes.json()

            if (workspaceData.ok && channelsData.ok) {
                setWorkspace(workspaceData.data.workspace)
                setChannels(channelsData.data.channels)
            } else {
                setError({ message: workspaceData.message || channelsData.message })
            }
        } catch (err) {
            setError({ message: "Error al conectar con el servidor" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (workspace_id) {
            getWorkspaceData()
        }
    }, [workspace_id]) // Se vuelve a ejecutar si el usuario cambia de workspace

    return {
        workspace,
        channels,
        loading,
        error,
        workspace_id,
        refetchChannels: getWorkspaceData // Útil para cuando creemos un canal nuevo
    }
}

export default useWorkspace