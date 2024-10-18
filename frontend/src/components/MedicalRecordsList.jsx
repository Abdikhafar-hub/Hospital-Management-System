import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MedicalRecordForm from './MedicalRecordForm';

const MedicalRecordList = () => {
    const [records, setRecords] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5555/medicalrecords');
            if (response.data && Array.isArray(response.data.records)) {
                setRecords(response.data.doctors); // Ensure it's an array
            } else {
                throw new Error('Unexpected data format');
            }
        } catch (err) {
            setError(err.message); // Set error message
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const toggleForm = () => setFormVisible(!formVisible);

    if (loading) {
        return <div>Loading doctors...</div>; // Loading state
    }

    if (error) {
        return <div>Error loading Records: {error}</div>; // Error state
    }

    return (
        <div>
            <h1>Medical Records</h1>
            <button onClick={toggleForm}>{formVisible ? 'Cancel' : 'Add Record'}</button>
            {formVisible && <MedicalRecordForm onClose={toggleForm} onRecordAdded={fetchRecords} />}
            <ul>
                {records.map(record => (
                    <li key={record.id}>{record.record_details}</li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalRecordList;
