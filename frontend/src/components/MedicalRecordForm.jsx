import React, { useState } from 'react';
import axios from 'axios';

const MedicalRecordForm = ({ onClose, onRecordAdded }) => {
    const [patientId, setPatientId] = useState('');
    const [recordDetails, setRecordDetails] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5555/medicalrecords', { patient_id: patientId, record_details: recordDetails });
        onRecordAdded();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
            <textarea placeholder="Record Details" value={recordDetails} onChange={(e) => setRecordDetails(e.target.value)} required></textarea>
            <button type="submit">Add Record</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default MedicalRecordForm;
