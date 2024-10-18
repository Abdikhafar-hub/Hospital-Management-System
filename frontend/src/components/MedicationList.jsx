import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MedicationForm from './MedicationForm';
import '../App.css';

const MedicationList = () => {
    const [medications, setMedications] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMedication, setEditingMedication] = useState(null); // For edit functionality

    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5555/medications');
            setMedications(response.data.medications);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5555/medications/${id}`);
            fetchMedications(); // Refresh the list after deletion
        } catch (error) {
            setError('Error deleting medication');
            console.error('Delete error:', error.response ? error.response.data : error);
        }
    };

    const handleEdit = (medication) => {
        setEditingMedication(medication); // Set the medication to edit
        setFormVisible(true);
    };

    const toggleForm = () => {
        setFormVisible(!formVisible);
        setEditingMedication(null); // Reset editing state
    };

    if (loading) return <div>Loading medications...</div>;
    if (error) return <div>Error loading medications: {error}</div>;

    return (
        <div>
            <h1>Medications</h1>

            <table className="medications-table">
                <thead>
                    <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map((medication) => (
                        <tr key={medication.id}>
                            <td>{medication.medication_name}</td>
                            <td>{medication.dosage}</td>
                            <td>
                                <button className="button-spacing" onClick={() => handleEdit(medication)}>Edit</button>
                                <button className="button-spacing" onClick={() => handleDelete(medication.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {formVisible && (
                <MedicationForm
                    onClose={toggleForm}
                    onMedicationAdded={fetchMedications}
                    editingMedication={editingMedication}
                />
            )}

            <button className="button-spacing" onClick={toggleForm}>
                {formVisible ? 'Cancel' : 'Add Medication'}
            </button>
        </div>
    );
};

export default MedicationList;
