import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllEmployees.css';

function AllEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch all employees from backend
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewDetails = (employeeId) => {
    // Logic to view employee details
    console.log(`View details for employee ${employeeId}`);
    // You can navigate to a details page or open a modal with employee details
  };

  const handleEditEmployee = (employeeId) => {
    // Logic to edit employee details
    console.log(`Edit employee ${employeeId}`);
    // You can navigate to an edit page or open a form for editing
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`https://your-backend-url.com/api/employees/${employeeId}`);
      // Remove the deleted employee from the list
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };

  return (
    <div className="all-employees">
      <h2>All Employees</h2>
      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <ul>
          {employees.map(employee => (
            <li key={employee.id} className="employee-item">
              <p>Name: {employee.name}</p>
              <p>Email: {employee.email}</p>
              <p>Role: {employee.role}</p>
              <button onClick={() => handleViewDetails(employee.id)}>View Details</button>
              <button onClick={() => handleEditEmployee(employee.id)}>Edit</button>
              <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllEmployees;
