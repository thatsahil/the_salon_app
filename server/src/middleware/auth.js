const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'salon_secret_key_12345';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    req.user = {
      ...decoded,
      id: userId,
      userId: userId,
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};
