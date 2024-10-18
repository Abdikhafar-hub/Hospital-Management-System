import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentForm from './DepartmentForm';
import '../App.css';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingDepartment, setEditingDepartment] = useState(null); 

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5555/departments');
            console.log(response.data.departments); 
            setDepartments(response.data.departments); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (departmentId) => {
        console.log("Deleting department with ID:", departmentId); 
        try {
            const response = await axios.delete(`http://127.0.0.1:5555/departments/${departmentId}`); 
            console.log("Delete response:", response.data); 
            fetchDepartments(); // Refresh the list after deletion
        } catch (error) {
            setError('Error deleting department');
            console.error('Delete error:', error.response ? error.response.data : error); 
        }
    };

    const handleEdit = (department) => {
        console.log("Editing department:", department); // Log the department being edited
        setEditingDepartment(department); // Set the department to edit
        setFormVisible(true);
    };

    const toggleForm = () => {
        setFormVisible(!formVisible);
        setEditingDepartment(null); // Reset editing state
    };

    if (loading) return <div>Loading departments...</div>;
    if (error) return <div>Error loading departments: {error}</div>;

    return (
        <div>
            <h1>Departments</h1>

            <table className="departments-table">
                <thead>
                    <tr >
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr key={department.id}>
                            <td>{department.department_name}</td>
                            <td>
                                <button className="button-spacing" onClick={() => handleEdit(department)}>Edit</button>
                                <button className="button-spacing" onClick={() => handleDelete(department.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {formVisible && <DepartmentForm onClose={toggleForm} onDepartmentAdded={fetchDepartments} editingDepartment={editingDepartment} />}

            <button className="add-department-button" onClick={toggleForm}>
                {formVisible ? 'Cancel' : 'Add Department'}
            </button>
        </div>
    );
};

export default DepartmentList;