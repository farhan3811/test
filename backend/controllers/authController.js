const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });

  const { email, password } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const newUser = await User.create(id, email, hashedPassword);

    return res.status(201).json({ message: 'User registered successfully', user: { id, email } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
