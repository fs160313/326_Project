var mongoose = require('mongoose');

// Schema definition for loan model
var LoanSchema = new mongoose.Schema({
  // Additional information can be added
  user_id: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  interest: { type: Number, required: true, min: 0 },
  subsidized: { type: Boolean, default: false }
});

module.exports = mongoose.model('loans', LoanSchema);
