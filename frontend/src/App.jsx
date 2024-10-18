import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminList from "./components/AdminList";
import PatientsList from "./components/PatientsList";
import DoctorsList from "./components/DoctorsList";
import AppointmentsList from "./components/AppointmentsList";
import MedicalRecordsList from "./components/MedicalRecordsList";
import DepartmentList from "./components/DepartmentList";
import MedicationList from "./components/MedicationList";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login functionality
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout functionality
  const handleLogout = () => {
    setIsLoggedIn(false); // Reset login state to false
  };

  return (
    <Router>
      <div>
        {isLoggedIn ? (
          <>
            {/* Show Navbar and Logout button when logged in */}
            <NavBar />
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>

            <Routes>
              <Route path="/admins" element={<AdminList />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/medications" element={<MedicationList />} />
              <Route path="*" element={<Navigate to="/admins" />} />{" "}
              {/* Redirect to admin list after login */}
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* Redirect to login if not logged in */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
