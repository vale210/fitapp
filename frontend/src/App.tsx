import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import { getCurrentUser } from './services/auth'

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const user = getCurrentUser();
  
  if (!user || !user.user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.user.rol)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.user) {
      setIsAuthenticated(true)
      setUserRole(user.user.rol)
    }
  }, [])

  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </ChakraProvider>
  )
}

export default App
