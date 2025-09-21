import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PermissionsManagement from './pages/PermissionsManagement'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/permissions" element={<PermissionsManagement />} />
      </Routes>
    </Layout>
  )
}

export default App