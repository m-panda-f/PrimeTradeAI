const express = require('express');
// ⭐ FIX: 1. Load environment variables from .env file
require('dotenv').config(); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Static folder to serve images

// MongoDB connection
mongoose
  // ⭐ FIX: 2. Use MONGO_URI from the .env file instead of hardcoded localhost
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Note: useCreateIndex and useFindAndModify options are deprecated and removed in recent Mongoose versions
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// ------------------ Schemas ------------------

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

// Employee Schema
const employeeSchema = new mongoose.Schema({
  f_Id: { type: String, required: true, unique: true },
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true },
  f_Mobile: { type: String, required: true },
  f_Designation: { type: String, required: true },
  f_gender: { type: String, required: true },
  f_Course: { type: [String], required: true },
  f_skills: { type: String, required: true }, 
});

const Employee = mongoose.model('Employee', employeeSchema);

// ------------------ Auth Routes ------------------

// Admin Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashedPassword });
  await admin.save();
  // ⭐ FIX: 3. Use JWT_SECRET from the .env file
  const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Registration successful', username: admin.username });
});

// Admin Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  // ⭐ FIX: 4. Use JWT_SECRET from the .env file
  const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '24h' }); 
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Login successful', username: admin.username });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    // ⭐ FIX: 5. Use JWT_SECRET from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is invalid' });
  }
};

// Dashboard route
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ username: req.user.username });
});

// Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// ------------------ Employee Routes ------------------

// Register Employee
app.post('/register-employee', async (req, res) => {
  const {
    f_Id,
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_gender,
    f_Course,
    f_skills,
  } = req.body;

  if (!f_Id || !f_Name || !f_Email || !f_Mobile || !f_Designation || !f_gender || !f_Course || !f_skills) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const newEmployee = new Employee({
      f_Id,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course,
      f_skills,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Get employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
});

// Update employee by ID
app.put('/update-employee/:id', async (req, res) => {
  const { id } = req.params;
  const {
    f_Id,
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_gender,
    f_Course,
    f_skills,
  } = req.body;

  if (!f_Id || !f_Name || !f_Email || !f_Mobile || !f_Designation || !f_gender || !f_Course || !f_skills) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        f_Id,
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_gender,
        f_Course,
        f_skills,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Delete employee by ID
app.delete('/delete-employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

// ------------------ Server ------------------
// ⭐ FIX: 6. Use PORT from the .env file, with 5000 as a fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});