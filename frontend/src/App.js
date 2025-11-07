import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login';
import Dashboard from './pages/dashboard';
import RegisterPage from './components/register';
import LandingPage from './pages/Landing';
import NewEmploye from './pages/createemploye';
import EditEmployee from './pages/Updateemployee'; 

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-employee" element={<NewEmploye />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
