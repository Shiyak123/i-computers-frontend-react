
import './App.css'
import { Routes, Route } from 'react-router-dom'

import HomePage from './components/pages/homePage'
import LoginPage from './components/pages/loginPage'
import RegisterPage from './components/pages/registerPage'
import AdminPage from './components/pages/adminPage'

function App() {
  return (
    <div className="w-full h-screen bg-red-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path='/admin/*' element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App
