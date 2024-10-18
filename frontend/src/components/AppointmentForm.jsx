import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AppointmentForm = ({ onClose, onAppointmentAdded, editingAppointment }) => {
  const [date, setDate] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setDate(editingAppointment.appointment_date);
      setPatientId(editingAppointment.patient_id);
      setDoctorId(editingAppointment.doctor_id); 
    } else {
      // Reset fields when not editing
      setDate('');
      setPatientId('');
      setDoctorId(''); 
    }
  }, [editingAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            appointment_date: date,
            patient_id: patientId,
            doctor_id: doctorId, 
        };

        console.log('Payload to be sent:', payload); 

        let response; 
        if (editingAppointment && editingAppointment.id) {
            // Editing existing appointment
            response = await axios.patch(`http://127.0.0.1:5555/appointments/${editingAppointment.id}`, payload);
            console.log('Response from updating', response.data);
        } else {
            // Adding new appointment
            response = await axios.post('http://127.0.0.1:5555/appointments', payload);
            console.log('Response from adding:', response.data); 
        }

        onAppointmentAdded();
        onClose(); // Close the form
    } catch (error) {
        console.error('Error saving appointment:', error);
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Patient Id" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
      <input type="text" placeholder="Doctor Id" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required /> 
      <button className="button-spacing" type="submit">{editingAppointment ? 'Update Appointment' : 'Add Appointment'}</button>
      <button className="button-spacing" type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default AppointmentForm;
