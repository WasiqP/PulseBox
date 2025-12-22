// Central export for all validation schemas
const authValidator = require('./authValidator');
const classValidator = require('./classValidator');
const taskValidator = require('./taskValidator');
const responseValidator = require('./responseValidator');

module.exports = {
  authValidator,
  classValidator,
  taskValidator,
  responseValidator,
};

