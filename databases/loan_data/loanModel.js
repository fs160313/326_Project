var mongoose = require('mongoose');

// Schema definition for loan model
var LoanSchema = new mongoose.Schema({
  // Additional information can be added
  totalDebt: { type: Number, required: true, min: 0 },
  payPeriod: Number,
  paymentAmount: Number,
  projectedSalary: { type: Number, min: 0 }
});

module.exports = mongoose.model('users', LoanSchema);
