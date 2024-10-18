import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorForm from './DoctorForm';
import '../App.css';


const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctorToEdit, setDoctorToEdit] = useState(null); // New state for editing

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5555/doctors');
            if (response.data && Array.isArray(response.data.doctors)) {
                setDoctors(response.data.doctors);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setFormVisible(!formVisible);
        setDoctorToEdit(null); // Reset editing state when toggling
    };

    const handleEdit = (doctor) => {
        setDoctorToEdit(doctor);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://127.0.0.1:5555/doctors/${id}`);
        fetchDoctors();
    };

    if (loading) {
        return <div>Loading doctors...</div>;
    }

    if (error) {
        return <div>Error loading doctors: {error}</div>;
    }

return (
  <div className="doctors-list">
    <h2>Doctors</h2>
   
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Speciality</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map(doctor => (
          <tr key={doctor.id}>
            <td>{doctor.name}</td>
            <td>{doctor.email}</td>
            <td>{doctor.speciality}</td>
            <td>
              <button className="button-spacing" onClick={() => handleEdit(doctor)}>Edit</button>
              <button className="button-spacing" onClick={() => handleDelete(doctor.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      <button className="add-doctor-button" onClick={toggleForm}>
        {formVisible ? 'Cancel' : 'Add Doctor'}
      </button>

      {formVisible && (
        <DoctorForm
          onClose={toggleForm}
          onDoctorAdded={fetchDoctors}
          doctorToEdit={doctorToEdit} // Pass the doctor to edit
        />
      )}
  </div>
);
}

export default DoctorList;
