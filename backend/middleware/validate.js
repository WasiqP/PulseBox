// Validation Middleware
// Validates request data using validation schemas

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // TODO: Implement validation using a library like Joi or express-validator
      // Validate req.body, req.params, req.query against schema
      // If validation fails, return 400 with error details
      // If validation passes, call next()
      
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details || [error.message]
      });
    }
  };
};

module.exports = validate;

