const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, rollNumber, class: cls, section, school, email, password } = req.body;
    const exists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (exists) return res.status(400).json({ message: 'Student already exists' });
    const student = await Student.create({ name, rollNumber, class: cls, section, school, email, password, unlockedDays: [1] });
    res.status(201).json({ token: sign(student._id), student: { ...student.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: sign(student._id), student: { ...student.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
