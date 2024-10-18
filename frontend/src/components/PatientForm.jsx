import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientForm = ({ onClose, onPatientAdded, editingPatient }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('')

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name);
      setAge(editingPatient.age);
      setGender(editingPatient.gender);
      setDate(editingPatient.date);
    }
  }, [editingPatient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await axios.patch(`http://127.0.0.1:5555/patients/${editingPatient.patient_id || editingPatient.id}`, {
          name,
          age,
          gender,
          date,
        });
      } else {
        await axios.post('http://127.0.0.1:5555/patients', {
          name,
          age,
          gender,
          date,
        });
      }
      onPatientAdded();
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
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
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">{editingPatient ? 'Update Patient' : 'Add Patient'}</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default PatientForm;
