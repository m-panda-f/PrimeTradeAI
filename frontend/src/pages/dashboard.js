import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('f_Name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!username) navigate('/');
  }, [navigate, username]);

  // Fetch employee list
  useEffect(() => {
    fetchEmployees();
  }, );

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
      // Apply initial filtering/sorting after fetch
      applyFilterAndSort(response.data, searchTerm, sortField, sortOrder);
    } catch (err) {
      setError('Error fetching employees');
    }
  };
  
  // Helper function to apply search and sort
  const applyFilterAndSort = (data, term, field, order) => {
    // 1. Filter
    const filtered = data.filter(
      (employee) =>
        employee.f_Name.toLowerCase().includes(term) ||
        employee.f_Id.toLowerCase().includes(term)
    );

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      const aValue = String(a[field]).toLowerCase();
      const bValue = String(b[field]).toLowerCase();

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sorted);
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/logout');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://localhost:5000/delete-employee/${id}`);
      setSuccess('Employee deleted successfully');
      setError('');
      fetchEmployees();
    } catch (err) {
      setError('Error deleting employee');
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    // Apply filter and sort instantly
    applyFilterAndSort(employees, term, sortField, sortOrder);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    
    // Apply filter and sort instantly
    applyFilterAndSort(employees, searchTerm, field, order);
  };

  useEffect(() => {
    // Apply the theme attribute to the body or html tag
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  return (
    <div className="dashboard">
      {/* Simplified Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/dashboard')}>
          <h2>PrimeTrade</h2>
        </div>
        <div className="nav-items">
          <div className="theme-toggle">
            <input
              type="checkbox"
              id="theme-switch"
              checked={theme === "dark"}
              onChange={toggleTheme}
              aria-label="Toggle dark mode" 
            />
            {/* The label is styled to look like a beautiful switch */}
            <label htmlFor="theme-switch" className="toggle-label"></label> 
          </div>
          <span className="username">Welcome, <b>{username}</b></span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Header */}
      <div className="header-section">
        <h1>Employee List</h1>
        <button onClick={() => navigate('/register-employee')} className="create-btn">
          + Create Employee
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '20px',
          }}
        />
        <span>Total Employees: <b>{filteredEmployees.length}</b></span>
      </div>

      {/* Error / Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Employee Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('f_Id')}>
              ID <span>{sortField === 'f_Id' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}</span>
            </th>
            <th onClick={() => handleSort('f_Name')}>
              Name <span>{sortField === 'f_Name' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}</span>
            </th>
            <th onClick={() => handleSort('f_Email')}>
              Email <span>{sortField === 'f_Email' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}</span>
            </th>
            <th>Mobile</th>
            <th onClick={() => handleSort('f_Designation')}>
              Designation{' '}
              <span>{sortField === 'f_Designation' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}</span>
            </th>
            <th>Gender</th>
            <th>Courses</th>
            {/* ⭐ ADDED SKILLS HEADER */}
            <th>Skills</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.f_Id}</td>
              <td>{employee.f_Name}</td>
              <td>
                <a href={`mailto:${employee.f_Email}`}>{employee.f_Email}</a>
              </td>
              <td>{employee.f_Mobile}</td>
              <td>{employee.f_Designation}</td>
              <td>{employee.f_gender}</td>
              <td>
                {employee.f_Course && employee.f_Course.length > 0 ? (
                  <ul className="course-list"> {/* Added class for potential styling */}
                    {employee.f_Course.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </td>
              {/* ⭐ ADDED SKILLS CELL */}
              <td>{employee.f_skills || '-'}</td>
              <td>
                <button
                  onClick={() => navigate(`/edit-employee/${employee._id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;