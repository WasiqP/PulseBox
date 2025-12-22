// Authentication validation schemas
// Use with express-validator or Joi

const authValidator = {
  signup: {
    // TODO: Define validation rules for signup
    // Example using Joi:
    // name: Joi.string().required().min(2).max(50),
    // email: Joi.string().email().required(),
    // password: Joi.string().required().min(6),
  },
  
  login: {
    // TODO: Define validation rules for login
    // email: Joi.string().email().required(),
    // password: Joi.string().required(),
  },
  
  forgotPassword: {
    // TODO: Define validation rules for forgot password
    // email: Joi.string().email().required(),
  },
  
  resetPassword: {
    // TODO: Define validation rules for reset password
    // token: Joi.string().required(),
    // password: Joi.string().required().min(6),
  },
};

module.exports = authValidator;

