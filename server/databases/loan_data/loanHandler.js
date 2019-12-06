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

  Returns: An array of loans
  */
  addLoans: function(req, res){
    let loans_arr = req.body.loans;
    loans_arr.forEach(loan_i => {
      let loan = new Loan({
        user_id: req.body.user_id,
        ...loan_i
      });
      loan.save(function(err, loan){
        if (err){
          res.json({'status': 'failure', 'message': err})
        }
        else{
          res.json({'status': 'success', 'message': 'Loan with id: ' + loan._id + ' saved.'});
        }
      });
    });
  },

  findLoans: function(req, res){
		Loan.find({user_id: req.query.user_id}, function(err, loans){
			if (loans != null){
        res.json({'status': 'success', 'message': 'Loans found.', 'loans': loans});
			}
			else{
				res.json({'status': 'failure', 'message': 'Loans not found.'});
			}
		});
  },

  modifyLoan: function(req, res){
    console.log(req.body.updates);
    Loan.updateOne({'_id': req.body.loan_id}, ...req.body.updates, function(err, loan){
      if (err){
        res.json({'status': 'failure', 'message': err});
      }
      else{
        res.json({'status': 'success'});
      }
    });
  },

  deleteLoan: function(req, res){
    Loan.deleteOne({'_id': req.body.loan_id}, function(err, loan){
      if (err){
        res.json({'status': 'failure', 'message': err});
      }
      else{
        res.json({'status': 'success'});
      }
    });
  }
  

};
