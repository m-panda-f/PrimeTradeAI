import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/createemployee.css';

const EmployeeRegistrationPage = () => {
  const [f_Id, setF_Id] = useState('');
  const [f_Name, setF_Name] = useState('');
  const [f_Email, setF_Email] = useState('');
  const [f_Mobile, setF_Mobile] = useState('');
  const [f_Designation, setF_Designation] = useState('');
  const [f_gender, setF_gender] = useState('');
  const [f_Course, setF_Course] = useState([]);
  const [f_skills, setF_skills] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate =useNavigate();
  const username = localStorage.getItem('username');


  
  useEffect(() => {
    // Check if user is logged in
    if (!username) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate, username]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. Basic required fields validation
    if (!f_Id || !f_Name || !f_Email || !f_Mobile || !f_Designation || !f_skills || !f_gender || !f_Course.length ) {
      setError('Please fill in all fields');
      return;
    }

    // 2. Mobile Number Validation (Exactly 10 digits, numeric only)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(f_Mobile)) {
      setError('Mobile number must be exactly 10 digits (numeric only)');
      return;
    }

    // 3. Skills Validation (Maximum 4 skills)
    // Clean up input: split by comma, trim whitespace, filter out empty strings
    const skillsArray = f_skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
      
    if (skillsArray.length > 4) {
      setError('Please limit your entry to a maximum of 4 skills.');
      return;
    }
    
    // Convert the validated/cleaned skills array back to a comma-separated string for submission
    const submittedSkills = skillsArray.join(', ');


    try {
      const response = await axios.post('http://localhost:5000/register-employee', {
        f_Id,
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_skills: submittedSkills, // Use the cleaned/validated skills string
        f_gender,
        f_Course,
      }, {
        headers: {
          'Content-Type': 'application/json' // Sending JSON data
        }
      });

      setSuccess(response.data.message);
      setError('');

      // Clear the form fields
      setF_Id('');
      setF_Name('');
      setF_Email('');
      setF_Mobile('');
      setF_Designation('');
      setF_gender('');
      setF_skills('');
      setF_Course([]);
      
      navigate('/dashboard');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };
  
  const handleLogout = async () => {
    // Note: The /logout endpoint should handle clearing server-side sessions/cookies if applicable
    await axios.post('http://localhost:5000/logout');
    localStorage.removeItem('username');
    navigate('/');
  };

 /* --- Updated JSX for EmployeeRegistrationPage.js --- */

return (
  <div className="employee-form-container"> {/* Use the container class */}
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/dashboard')}>
        <h2>PrimeTrade</h2>
      </div>
      <div className="nav-items">
        <span className="username">Welcome, <b>{username}</b></span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
    
    <h3>Employee Registration</h3> {/* Use h3 for consistent heading style */}
    
    <div className="employee-form-wrapper">
      <form onSubmit={handleSubmit}>
        
        {/* Employee ID */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Employee ID"
            value={f_Id}
            onChange={(e) => setF_Id(e.target.value)}
          />
        </div>

        {/* Name */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={f_Name}
            onChange={(e) => setF_Name(e.target.value)}
          />
        </div>
        
        {/* Email */}
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={f_Email}
            onChange={(e) => setF_Email(e.target.value)}
          />
        </div>

        {/* Mobile (Type changed to text for controlled input, validation handled in JS) */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Mobile (10 digits)"
            value={f_Mobile}
            onChange={(e) => setF_Mobile(e.target.value)}
          />
        </div>

        {/* Designation */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Designation"
            value={f_Designation}
            onChange={(e) => setF_Designation(e.target.value)}
          />
        </div>

        {/* Gender Selection using Dropdown/Select */}
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
        
        {/* Skills adding using text area */}
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
        
        {error && <p className="error-message">❌ {error}</p>}
        {success && <p className="success-message">✅ {success}</p>}

        {/* Action Buttons (Register and Back) */}
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
              className="update-button register-button"
            >
              Register Employee
            </button>
        </div>

      </form>
    </div>
  </div>
);
};

export default EmployeeRegistrationPage;