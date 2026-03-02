const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'wawa';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
