import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/updateemployee.css'; // Your specific style file

const EditEmployee = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  // Function for the logout button
  const handleLogout = async () => {
    // This assumes your backend has a /logout endpoint
    await axios.post('http://localhost:5000/logout');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [navigate, username]);
  
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [f_Name, setF_Name] = useState('');
  const [f_Id, setF_Id] = useState('');
  const [f_Email, setF_Email] = useState('');
  const [f_Mobile, setF_Mobile] = useState('');
  const [f_Designation, setF_Designation] = useState('');
  const [f_gender, setF_gender] = useState('');
  const [f_Course, setF_Course] = useState([]);
  // ⭐ Added state for skills
  const [f_skills, setF_skills] = useState(''); 

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch employee data and populate state
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employees/${id}`);
        const employeeData = response.data;

        setEmployee(employeeData);
        setF_Id(employeeData.f_Id);
        setF_Name(employeeData.f_Name);
        setF_Email(employeeData.f_Email);
        setF_Mobile(employeeData.f_Mobile);
        setF_Designation(employeeData.f_Designation);
        setF_gender(employeeData.f_gender);
        setF_Course(employeeData.f_Course || []);
        // ⭐ Populate skills state from fetched data
        setF_skills(employeeData.f_skills || ''); 
      } catch (err) {
        setError('Error fetching employee data');
      }
    };

    fetchEmployee();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // 1. Basic required fields validation
    if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_gender || !f_skills || !f_Course.length) {
      setError('Please fill in all required fields.');
      return;
    }

    // 2. Mobile Number Validation (Exactly 10 digits, numeric only)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(f_Mobile)) {
      setError('Mobile number must be exactly 10 digits (numeric only).');
      return;
    }

    // 3. Skills Validation (Maximum 4 skills)
    // Clean up input: split by comma, trim whitespace, filter out empty strings
    const skillsArray = f_skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
      
    if (skillsArray.length > 4) {
      setError('Please limit the skills entry to a maximum of 4 skills.');
      return;
    }
    
    // Convert the validated/cleaned skills array back to a comma-separated string for submission
    const submittedSkills = skillsArray.join(', ');


    const updatedData = {
      f_Id,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course,
      f_skills: submittedSkills, // Use the cleaned/validated skills string
    };

    try {
      await axios.put(`http://localhost:5000/update-employee/${id}`, updatedData);
      setSuccess('Employee updated successfully');
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.message || 'Error updating employee');
    }
  };
  
  

  if (!employee) {
    return <p className="loading-message">Loading...</p>;
  }

  return (
    <div className="employee-form-container">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/dashboard')}>
          <h2>PrimeTrade</h2>
        </div>
        <div className="nav-items">
          <span className="username">Welcome, <b>{username}</b></span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <h3>Edit Employee: {employee.f_Name}</h3>

      <div className="employee-form-wrapper"> 
        <form onSubmit={handleUpdate}>
          
          {/* Employee ID (Read Only) */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID"
              value={f_Id}
              onChange={(e) => setF_Id(e.target.value)}
              readOnly
            />
          </div>

          {/* Name, Email, Mobile */}
          <div className="form-group"><input type="text" placeholder="Name" value={f_Name} onChange={(e) => setF_Name(e.target.value)} /></div>
          <div className="form-group"><input type="email" placeholder="Email" value={f_Email} onChange={(e) => setF_Email(e.target.value)} /></div>
          {/* Mobile input placeholder updated */}
          <div className="form-group"><input type="text" placeholder="Mobile (10 digits)" value={f_Mobile} onChange={(e) => setF_Mobile(e.target.value)} /></div>
          
          {/* Designation */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Designation"
              value={f_Designation}
              onChange={(e) => setF_Designation(e.target.value)}
            />
          </div>

          {/* Gender Selection */}
          <div className="form-group radio-group">
            <select
              value={f_gender}
              onChange={(e) => setF_gender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          
          {/* ⭐ SKILLS TEXTAREA (ADDED) */}
          <div className="form-group">
            <input
              type="textarea"
              placeholder="Skills (Max 4, comma separated)"
              value={f_skills}
              onChange={(e) => setF_skills(e.target.value)}
            />
          </div>

          {/* Course Selection */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Course"
              value={f_Course.join(', ')}
              onChange={(e) => setF_Course(e.target.value.split(',').map(course => course.trim()))}
            />
          </div>

          {/* Action Buttons (Back/Cancel and Update) */}
          <div className="form-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate('/dashboard')}
              >
                Cancel / Back
              </button>
              <button
                type="submit"
                className="update-button"
              >
                Update Employee
              </button>
          </div>

          {error && <p className="error-message">❌ {error}</p>}
          {success && <p className="success-message">✅ {success}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;