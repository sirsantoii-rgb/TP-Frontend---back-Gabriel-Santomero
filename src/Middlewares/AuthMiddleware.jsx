import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AuthMiddleware() {
  const { isLogged, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>; // ⬅ Espera a que termine de revisar token
  if (isLogged) return <Outlet />;           // ⬅ Usuario autenticado, renderiza rutas hijas
  return <Navigate to="/login" />;           // ⬅ No autenticado, redirige a login
}

export default AuthMiddleware;
