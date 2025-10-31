import { Routes, Route } from 'react-router-dom'
import './App.css'
// Contexts
import { AuthProvider } from './contexts/AuthContext'
// General Layouts
import UserLayout from './layouts/UserLayout'
import Home from './pages/General/Home'
import About from './pages/General/About'
import Contact from './pages/General/Contact'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import MedicineManagement from './pages/Admin/MedicineManagement'
import ServiceManagement from './pages/Admin/ServiceManagement'
import Chat from './components/chat'
import Doctor from './pages/Doctor/Doctor';
function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='chat' element={<Chat />} />
          <Route path='doctor' element={<Doctor />} />
        </Route>

        <Route path='admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='medicines' element={<MedicineManagement />} />
          <Route path='services' element={<ServiceManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
