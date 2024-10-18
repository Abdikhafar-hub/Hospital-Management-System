import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'

const DepartmentForm = ({ onClose, onDepartmentAdded, editingDepartment }) => {
    const [departmentName, setDepartmentName] = useState('');

    useEffect(() => {
        if (editingDepartment) {
            setDepartmentName(editingDepartment.department_name); 
        } else {
            setDepartmentName(''); 
        }
    }, [editingDepartment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingDepartment) {
            if (editingDepartment.id) { 
                await axios.patch(`http://127.0.0.1:5555/departments/${editingDepartment.id}`, { department_name: departmentName });
            } else {
                console.error("Editing department ID is undefined.");
            }
        } else {
            await axios.post('http://127.0.0.1:5555/departments', { department_name: departmentName });
        }
        onDepartmentAdded(); 
        onClose(); // Close the form
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
            />
            <button className="button-spacing" type="submit">{editingDepartment ? 'Update Department' : 'Add Department'}</button>
            <button className="button-spacing" type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default DepartmentForm;
