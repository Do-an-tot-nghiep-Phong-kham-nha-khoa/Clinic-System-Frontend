
import { Routes, Route } from 'react-router-dom'
import './App.css'
// Contexts
import { AuthProvider } from './contexts/AuthContext'
// General Layouts & Pages
import UserLayout from './layouts/UserLayout'
import Home from './pages/General/Home'
import DoctorsPage from './pages/General/Doctors'
import About from './pages/General/About'
import Contact from './pages/General/Contact'
// Admin Pages & Layouts
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import MedicineManagement from './pages/Admin/MedicineManagement'
import ServiceManagement from './pages/Admin/ServiceManagement'
import RegisterPage from './pages/Auth/Register'
import AccountManagement from './pages/Admin/AccountManagement'
import InvoiceManagement from './pages/Admin/InvoiceManagement'
import RoleManagement from './pages/Admin/RoleManagement'
import AppointmentManagement from './pages/Admin/AppointmentManagement'
// Doctor Pages & Layouts
import DoctorLayout from './layouts/DoctorLayout'
import DoctorAppointment from './pages/Doctor/DoctorAppointment'
import DoctorMedicalRecord from './pages/Doctor/DoctorMedicalRecord'
import DoctorTreatment from './pages/Doctor/DoctorTreatment'
// Patient Pages & Layouts
import PatientLayout from './layouts/PatientLayout'
import PatientProfile from './pages/Patient/PatientProfile'
import PatientAppointmentDoctor from './pages/Patient/PatientAppointmentDoctor'
import PatientAppointment from './pages/Patient/PatientAppointment'
import PatientTreatmentHistory from './pages/Patient/PatientTreatmentHistory'
import PatientAppointmentSpecialty from './pages/Patient/PatientAppointmentSpecialty'
import Chat from './components/chat'
// Receptionist Pages & Layouts
import ReceptionistLayout from './layouts/ReceptionistLayout'
import ReceptionistProfile from './pages/Receptionist/ReceptionistProfile'
import ReceptionistAppointment from './pages/Receptionist/ReceptionistAppointment'
import ReceptionistTreatment from './pages/Receptionist/ReceptionistTreatment'
import ReceptionistInvoice from './pages/Receptionist/ReceptionistInvoice'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import HealthProfile from './pages/Patient/HealthProfile'
import LoginPage from './pages/Auth/LoginPage'
import ProtectedRoute from './components/ProtectedRoutes'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='doctors' element={<DoctorsPage />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='chat' element={<Chat />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </ Route>

        <Route path='admin' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path='medicines' element={<MedicineManagement />} />
          <Route path='services' element={<ServiceManagement />} />
          <Route path='roles' element={<RoleManagement />} />
          <Route path='invoices' element={<InvoiceManagement />} />
          <Route path='users' element={<AccountManagement />} />
          <Route path='appointments' element={<AppointmentManagement />} />
        </Route>

        <Route path='doctor' element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DoctorProfile />} />
          <Route path='medical-records' element={<DoctorMedicalRecord />} />
          <Route path='treatments' element={<DoctorTreatment />} />
          <Route path='appointments' element={<DoctorAppointment />} />
        </Route>

        <Route path='patient' element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PatientProfile />} />
          <Route path='appointments' element={<PatientAppointment />} />
          <Route path='appointments-specialty' element={<PatientAppointmentSpecialty />} />
          <Route path='appointments-doctor' element={<PatientAppointmentDoctor />} />
          <Route path='medical-records' element={<PatientTreatmentHistory />} />
          <Route path='chatbot' element={<Chat />} />
          <Route path='health-profile' element={<HealthProfile />} />
        </Route>

        <Route path='receptionist' element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ReceptionistProfile />} />
          <Route path='appointments' element={<ReceptionistAppointment />} />
          <Route path='treatments' element={<ReceptionistTreatment />} />
          <Route path='invoices' element={<ReceptionistInvoice />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
