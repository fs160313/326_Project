var Loan = require('./loanModel.js')

module.exports = {
	testingPrintLoan: function(user_id){
		console.log(username);
		Loan.findOne({username: username}, function(err, user){
			console.log(user);
			if (user != null){

			}
			else{
				console.log("User not found.");
			}
		});
	},

	findLoans: function(username, password, email){
		var user = new User({
			username: username,
			password: password,
			email: email
		});
		console.log(user);

		user.save(function(err, user) {
			if (err){
				console.log("ERROR");
				console.log(err);
			}
      else{
				console.log("User with id: " + user._id + " saved.");  
			}
   	});
  },

  /*
  Parameters: JSON object formatted as such:
  {
    "user_id": 5,
    "loans": [
      {
        "amount": 1000,
        "interest": 5.5,
        "subsidized": true
      },
      {
        "amount": 10000000,
        "interest": 75,
        "subsidized": false
      }
    ]
  }

  Returns: An array of loans (WIP - console only while API is being set up)
  */
  addLoans: function(username, password, email){
		var user = new User({
			username: username,
			password: password,
			email: email
		});
		console.log(user);

		user.save(function(err, user) {
			if (err){
				console.log("ERROR");
				console.log(err);
			}
      else{
				console.log("User with id: " + user._id + " saved.");  
			}
   	});
  }
  

};
