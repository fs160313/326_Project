var mongoose = require('mongoose');

// Schema definition for user model
var UserSchema = new mongoose.Schema({
  // Additional information can be added
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  monthly_payment: { type: Number, min: 0 },
  projected_salary: { type: Number, min: 0 }, // added option for later (not required right now)
  total_debt: { type: Number, min: 0 } // added option for later (not required right now)
});

module.exports = mongoose.model('users', UserSchema);
