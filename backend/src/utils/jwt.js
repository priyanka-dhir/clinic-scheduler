const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';

function sign(payload, opts = {}) {
  return jwt.sign(payload, secret, { expiresIn: '8h', ...opts });
}

function verify(token) {
  return jwt.verify(token, secret);
}

module.exports = { sign, verify };
