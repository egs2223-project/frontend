import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import RegisterDoctor from './pages/register_doctor';
import RegisterPatient from './pages/register_patient';
import Appointments from './pages/appointments'
import NewAppointment from './pages/NewAppointment'
import Homepage from './pages/homepage'

export const Context = React.createContext(null);

function App() {
  const [ctx, set_ctx] = React.useState({user_data: null, user_role: null, status: 'uninitialized'});

  return (
    <BrowserRouter>
      <Context.Provider value={{ctx, set_ctx}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/doctor" element={<RegisterDoctor/>} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/createAppointment" element={<NewAppointment />} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
