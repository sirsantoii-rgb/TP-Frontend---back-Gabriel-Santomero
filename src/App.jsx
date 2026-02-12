import React from 'react'
import { Route, Routes } from 'react-router'
import LoginScreen from './Screens/LoginScreen/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import ForgotPasswordScreen from './Screens/LoginScreen/ForgotPasswordScreen' // Nueva
import ResetPasswordScreen from './Screens/LoginScreen/ResetPasswordScreen' // Nueva
import AuthContextProvider from './Context/AuthContext'
import AuthMiddleware from './Middlewares/AuthMiddleware'
import WorkspaceContextProvider from './Context/WorkspaceContext'
import HomeScreen from './Screens/HomeScreen/HomeScreen'
import CreateWorkspaceScreen from './Screens/CreateWorkspaceScreen/CreateWorkspaceScreen'
import WorkspaceScreen from './Screens/WorkspaceScreen/WorkspaceScreen' // 1. Importar la nueva pantalla

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<LoginScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
        <Route path='/reset-password' element={<ResetPasswordScreen />} />

        {/* Rutas privadas (Protegidas por AuthMiddleware) */}
        <Route element={<AuthMiddleware />}>
          <Route path='/home' element={
            <WorkspaceContextProvider>
              <HomeScreen />
            </WorkspaceContextProvider>
          } />
          <Route path='/create-workspace' element={<CreateWorkspaceScreen />} />
          
          {/* 2. Añadir la ruta del Workspace con el parámetro :workspace_id */}
          <Route path='/workspace/:workspaceId' element={<WorkspaceScreen />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}