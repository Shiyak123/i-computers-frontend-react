
import './App.css'
import { Routes, Route } from 'react-router-dom'

import HomePage from './components/pages/homePage'
import LoginPage from './components/pages/loginPage'
import RegisterPage from './components/pages/registerPage'
import AdminPage from './components/pages/adminPage'
import TestPage from './components/pages/testPage'
import ProductsPage from './components/pages/productsPage'
import ProductOverview from './components/pages/productOverview'
import CartPage from './components/pages/cartPage'
import CheckoutPage from './components/pages/checkoutPage'
import OrdersPage from './components/pages/ordersPage'
import Header from './components/header'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-primary text-slate-100">
      <Toaster position='top-right' />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductOverview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/admin/*' element={<AdminPage />} />
          <Route path='/test' element={<TestPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
