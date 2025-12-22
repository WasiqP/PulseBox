// Password comparison utility
// Compares plain password with hashed password

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    // TODO: Implement password comparison using bcrypt
    // const bcrypt = require('bcryptjs');
    // return await bcrypt.compare(plainPassword, hashedPassword);
    
    return plainPassword === hashedPassword; // Placeholder
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

module.exports = comparePassword;

