import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ClientAuthProvider } from './context/ClientAuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <ClientAuthProvider>
              <CartProvider>
                <ChatProvider>
                  <NotificationProvider>
                    <App />
                  </NotificationProvider>
                </ChatProvider>
              </CartProvider>
            </ClientAuthProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
)
