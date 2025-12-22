// Central export for all services
// Services handle complex business logic

const emailService = require('./emailService');
const reportService = require('./reportService');
const analyticsService = require('./analyticsService');

module.exports = {
  emailService,
  reportService,
  analyticsService,
};

