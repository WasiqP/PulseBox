// Password hashing utility
// Uses bcrypt to hash passwords

const hashPassword = async (password) => {
  try {
    // TODO: Implement password hashing using bcrypt
    // const bcrypt = require('bcryptjs');
    // const salt = await bcrypt.genSalt(10);
    // const hashed = await bcrypt.hash(password, salt);
    // return hashed;
    
    return password; // Placeholder
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

module.exports = hashPassword;

