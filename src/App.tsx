
import { Routes, Route } from 'react-router-dom'
import './App.css'
// Contexts
import { AuthProvider } from './contexts/AuthContext'
// General Layouts & Pages
import UserLayout from './layouts/UserLayout'
import Home from './pages/GeneralPages/Home'
import DoctorsPage from './pages/GeneralPages/Doctors'
import About from './pages/GeneralPages/About'
import Contact from './pages/GeneralPages/Contact'
// Admin Pages & Layouts
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminPages/AdminDashboard'
import MedicineManagement from './pages/AdminPages/MedicineManagement'
import ServiceManagement from './pages/AdminPages/ServiceManagement'
import RegisterPage from './pages/Auth/Register'
import AccountManagement from './pages/AdminPages/AccountManagement'
import InvoiceManagement from './pages/AdminPages/InvoiceManagement'
import RoleManagement from './pages/AdminPages/RoleManagement'
import AppointmentManagement from './pages/AdminPages/AppointmentManagement'
// Doctor Pages & Layouts
import DoctorLayout from './layouts/DoctorLayout'
import DoctorAppointment from './pages/DoctorPages/DoctorAppointment'
import DoctorMedicalRecord from './pages/DoctorPages/DoctorMedicalRecord'
import DoctorTreatment from './pages/DoctorPages/DoctorTreatment'
// Patient Pages & Layouts
import PatientLayout from './layouts/PatientLayout'
import PatientProfile from './pages/PatientPages/PatientProfile'
import PatientMedicalRecord from './pages/PatientPages/PatientMedicalRecord'
import PatientAppointmentDoctor from './pages/PatientPages/PatientAppointmentDoctor'
import PatientAppointmentSpecialty from './pages/PatientPages/PatientAppointmentSpecialty'
import Chat from './components/chat'
// Receptionist Pages & Layouts
import ReceptionistLayout from './layouts/ReceptionistLayout'
import ReceptionistProfile from './pages/ReceptionistPages/ReceptionistProfile'
import ReceptionistAppointment from './pages/ReceptionistPages/ReceptionistAppointment'
import ReceptionistTreatment from './pages/ReceptionistPages/ReceptionistTreatment'
import ReceptionistInvoice from './pages/ReceptionistPages/ReceptionistInvoice'
import DoctorProfile from './pages/DoctorPages/DoctorProfile'
import HealthProfile from './pages/PatientPages/HealthProfile'
import LoginPage from './pages/Auth/LoginPage'


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

        <Route path='admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='medicines' element={<MedicineManagement />} />
          <Route path='services' element={<ServiceManagement />} />
          <Route path='roles' element={<RoleManagement />} />
          <Route path='invoices' element={<InvoiceManagement />} />
          <Route path='users' element={<AccountManagement />} />
          <Route path='appointments' element={<AppointmentManagement />} />
        </Route>

        <Route path='doctor' element={<DoctorLayout />}>
          <Route index element={<DoctorProfile />} />
          <Route path='medical-records' element={<DoctorMedicalRecord />} />
          <Route path='treatments' element={<DoctorTreatment />} />
          <Route path='appointments' element={<DoctorAppointment />} />
        </Route>

        <Route path='patient' element={<PatientLayout />}>
          <Route index element={<PatientProfile />} />
          <Route path='appointments-doctor' element={<PatientAppointmentDoctor />} />
          <Route path='appointments-specialty' element={<PatientAppointmentSpecialty />} />
          <Route path='medical-records' element={<PatientMedicalRecord />} />
          <Route path='chatbot' element={<Chat />} />
          <Route path='health-profile' element={<HealthProfile />} />
        </Route>

        <Route path='receptionist' element={<ReceptionistLayout />}>
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
