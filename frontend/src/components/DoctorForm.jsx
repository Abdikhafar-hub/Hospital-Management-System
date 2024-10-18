import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const DoctorForm = ({ onClose, onDoctorAdded, doctorToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState('');

  useEffect(() => {
    if (doctorToEdit) {
      setName(doctorToEdit.name);
      setEmail(doctorToEdit.email);
      setSpeciality(doctorToEdit.speciality);
    }
  }, [doctorToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (doctorToEdit) {
        await axios.patch(`http://127.0.0.1:5555/doctors/${doctorToEdit.id}`, {
          name,
          email,
          speciality,
        });
      } else {
        await axios.post('http://127.0.0.1:5555/doctors', { name, email, speciality });
      }
      onDoctorAdded();
      onClose();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Speciality"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        required
      />
      <button className="button-spacing" type="submit">
        {doctorToEdit ? 'Update Doctor' : 'Add Doctor'}
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default DoctorForm;
