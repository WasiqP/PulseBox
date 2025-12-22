// Central export for all utility functions
const generateId = require('./generateId');
const hashPassword = require('./hashPassword');
const comparePassword = require('./comparePassword');
const generateToken = require('./generateToken');
const sendEmail = require('./sendEmail');

module.exports = {
  generateId,
  hashPassword,
  comparePassword,
  generateToken,
  sendEmail,
};

