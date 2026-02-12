import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();
export const AUTH_TOKEN_KEY = "auth_token";

function decodeAuthToken(auth_token) {
  try {
    return jwtDecode(auth_token);
  } catch {
    return null;
  }
}

function AuthContextProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true); // ⬅ Estado de carga inicial
  const [session, setSession] = useState(null);

  useEffect(() => {
    const auth_token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (auth_token) {
      const decoded = decodeAuthToken(auth_token);
      if (decoded) {
        setIsLogged(true);
        setSession(decoded);
      } else {
        // Token inválido
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
    setLoading(false); // ⬅ Terminó la verificación del token
  }, []);

  function saveSession(auth_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, auth_token);
    setIsLogged(true);
    setSession(decodeAuthToken(auth_token));
  }

  const providerValues = {
    saveSession,
    session,
    isLogged,
    loading // ⬅ Lo exponemos para el middleware
  };

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
