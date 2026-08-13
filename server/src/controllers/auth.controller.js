const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { memoryStore, getIsConnected } = require('./store');

const JWT_SECRET = process.env.JWT_SECRET || 'salon_secret_key_12345';

exports.signup = async (req, res) => {
  try {
    const { name, email, password, salonName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let existingUser;

    if (getIsConnected()) {
      existingUser = await User.findOne({ email: cleanEmail });
    } else {
      existingUser = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userSalonName = salonName && salonName.trim() ? salonName.trim() : 'Serene Salon & Studio';

    let user;

    if (getIsConnected()) {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        salonName: userSalonName,
      });
    } else {
      user = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        salonName: userSalonName,
        createdAt: new Date().toISOString(),
      };
      memoryStore.users.push(user);
    }

    const userIdStr = String(user._id);
    const token = jwt.sign(
      { id: userIdStr, userId: userIdStr, email: user.email, name: user.name, salonName: user.salonName },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        salonName: user.salonName,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user;

    if (getIsConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userIdStr = String(user._id);
    const token = jwt.sign(
      { id: userIdStr, userId: userIdStr, email: user.email, name: user.name, salonName: user.salonName },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        salonName: user.salonName,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    let user = null;

    if (getIsConnected()) {
      const dbUser = await User.findById(userId).select('-passwordHash').lean();
      if (dbUser) {
        user = {
          id: String(dbUser._id),
          name: dbUser.name,
          email: dbUser.email,
          salonName: dbUser.salonName,
        };
      }
    } else {
      const memUser = memoryStore.users.find((u) => String(u._id) === String(userId));
      if (memUser) {
        user = {
          id: String(memUser._id),
          name: memUser.name,
          email: memUser.email,
          salonName: memUser.salonName,
        };
      }
    }

    if (!user) {
      user = {
        id: req.user.id || req.user.userId,
        name: req.user.name,
        email: req.user.email,
        salonName: req.user.salonName,
      };
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
