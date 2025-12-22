// Central export for all middleware
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const authenticate = require('./auth');
const validate = require('./validate');
const logger = require('./logger');

module.exports = {
  errorHandler,
  notFound,
  authenticate,
  validate,
  logger,
};

