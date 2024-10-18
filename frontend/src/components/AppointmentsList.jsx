import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import '../App.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5555/appointments');
      console.log('Fetched appointments:', response.data.appointments);
      if (response.data && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointment) => {
    try {
      await axios.delete(`http://127.0.0.1:5555/appointments/${appointment.id}`);
      fetchAppointments(); // Refresh the list after deletion
    } catch (error) {
      setError('Error deleting appointment');
      console.error('Error deleting appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    console.log('Editing appointment:', appointment);
    setEditingAppointment(appointment);
    setFormVisible(true);
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
    setEditingAppointment(null); // Reset editing state
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments: {error}</div>;
  }

  return (
    <div className="appointments-list">
      <h1>Appointments List</h1>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient Id</th>
            <th>Doctor Id</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.appointment_date}</td>
              <td>{appointment.patient_id ? appointment.patient_id : 'No Patient'}</td> {/* Display patient info */}
              <td>{appointment.doctor_id ? appointment.doctor_id : 'No Doctor'}</td> {/* Display doctor info */}
              <td>
                <button className="button-spacing" onClick={() => handleEdit(appointment)}>Edit</button>
                <button className="button-spacing" onClick={() => handleDelete(appointment)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-appointment-button" onClick={toggleForm}>
        {formVisible ? 'Cancel' : 'Add Appointment'}
      </button>
      {formVisible && (
        <AppointmentForm
          onClose={toggleForm}
          onAppointmentAdded={fetchAppointments}
          editingAppointment={editingAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentList;
