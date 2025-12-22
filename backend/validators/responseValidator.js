// Response validation schemas

const responseValidator = {
  submit: {
    // TODO: Define validation rules for submitting a response
  },
  
  grade: {
    // TODO: Define validation rules for grading a response
    // score: Joi.number().min(0).required(),
    // feedback: Joi.string().optional(),
  },
};

module.exports = responseValidator;

