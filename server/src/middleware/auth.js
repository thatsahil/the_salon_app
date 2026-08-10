const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'salon_secret_key_12345';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In dev mode, attach default owner user if no token sent
    req.user = {
      id: 'user_1',
      name: 'Akshay Kumar',
      email: 'akshay@serenesalon.com',
      salonName: 'Serene Salon & Studio',
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
