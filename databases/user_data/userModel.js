var mongoose = require('mongoose');

// Schema definition for user model
var UserSchema = new mongoose.Schema({
  // Additional information can be added
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: String
});

module.exports = mongoose.model('users', UserSchema);
