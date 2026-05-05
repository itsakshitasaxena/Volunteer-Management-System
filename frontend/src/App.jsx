import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
