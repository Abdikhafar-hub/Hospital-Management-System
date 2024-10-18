import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'

const MedicationForm = ({ onClose, onMedicationAdded, editingMedication }) => {
    const [medication, setMedication] = useState('');
    const [dosage, setDosage] = useState('');

    useEffect(() => {
        if (editingMedication) {
            setMedication(editingMedication.medication_name);
            setDosage(editingMedication.dosage);
        } else {
            setMedication('');
            setDosage('');
        }
    }, [editingMedication]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                medication_name: medication,
                dosage: dosage,
            };

            if (editingMedication && editingMedication.id) {
                // Update medication
                await axios.patch(`http://127.0.0.1:5555/medications/${editingMedication.id}`, payload);
            } else {
                // Add new medication
                await axios.post('http://127.0.0.1:5555/medications', payload);
            }

            onMedicationAdded(); // Refresh the list of medications
            onClose(); // Close the form
        } catch (error) {
            console.error('Error saving medication:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="button-spacing"
                type="text"
                placeholder="Medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                required
            />
            <input
                className="button-spacing"
                type="text"
                placeholder="Dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
            />

            <button className="button-spacing" type="submit">{editingMedication ? 'Update Medication' : 'Add Medication'}</button>
            <button className="button-spacing" type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}

export default MedicationForm;
