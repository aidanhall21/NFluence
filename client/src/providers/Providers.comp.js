import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from "./UserProvider"
//import TxProvider from './TxProvider'
import AuthProvider from './AuthProvider'

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
          <UserProvider>
            <div className="app">
              {children}
            </div>
          </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
