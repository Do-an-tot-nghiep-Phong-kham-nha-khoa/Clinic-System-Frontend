import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
// General Layouts
import UserLayout from './layouts/User/UserLayout'
import Home from './pages/General/Home'
import About from './pages/General/About'
import Contact from './pages/General/Contact'

function App() {

  return (
    <Routes>
      <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
      </ Route>
    </Routes>
  )
}

export default App
