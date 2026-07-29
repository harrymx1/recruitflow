const { verifyAccessToken } = require('../utils/jwt');

const authenticateCandidate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.type !== 'candidate') {
      return res.status(403).json({ message: 'Forbidden: invalid token type' });
    }
    
    req.candidate = {
      id: decoded.id
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateCandidate;
