const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from header
  const authHeader = req.headers.authorization;

  // 2. Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Get token from header string
    const token = authHeader.split(' ')[1];

    // 4. Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        // 5. Add user from payload to the request object
        req.user = decoded.user;
        // 6. Call next() to proceed
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};  

