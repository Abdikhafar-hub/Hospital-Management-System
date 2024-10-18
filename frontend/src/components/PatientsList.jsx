import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientForm from './PatientForm';
import '../App.css'; 

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5555/patients');
      if (response.data && Array.isArray(response.data.patients)) {
        setPatients(response.data.patients);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5555/patients/${id}`);
      fetchPatients();
    } catch (error) {
      setError("Error deleting patient");
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormVisible(true); // Show the form for editing
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
    setEditingPatient(null); // Reset editing state
  };

  if (loading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>Error loading patients: {error}</div>;
  }

 return (
  <div className="patients-list">
    <h2>Patients</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td>{patient.name}</td>
            <td>{patient.age}</td>
            <td>{patient.gender}</td>
            <td>{patient.date}</td>
            <td>
              <button className="button-spacing" onClick={() => handleEdit(patient)}>Edit</button>
              <button className="button-spacing" onClick={() => handleDelete(patient.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      <button className="add-patient-button" onClick={toggleForm}>
        {formVisible ? 'Cancel' : 'Add Patient'}
      </button>

      {formVisible && (
        <PatientForm
          onClose={toggleForm}
          onPatientAdded={fetchPatients}
          editingPatient={editingPatient} // Pass the editing patient to the form
        />
      )}
  </div>
);

};

export default PatientsList;
