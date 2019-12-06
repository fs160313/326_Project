// Require handlers we need for the user database as well as the loan database
var userHandler = require('../databases/user_data/userHandler.js');
var loanHandler = require('../databases/loan_data/loanHandler.js');

// Function
module.exports = function(app){

  /*
    Define routes here
    Example route: app.post('api/deleteloan', userHandler.deleteLoan);
  */

  //routes for loan endpoints
  app.post('/loan', loanHandler.addLoans)
  app.get('/loan', loanHandler.findLoans);
  app.put('/loan', loanHandler.modifyLoan)
  app.delete('/loan', loanHandler.deleteLoan) 

  //routes for user endpoints
  app.post('/user', userHandler.createUser) //done
  app.put('/user', userHandler.modifyUser) //done
  app.delete('/user', userHandler.deleteUser) //done

  app.get('/user', userHandler.verify) //done

  let path = require('path');
  app.get('/create_account', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../create_account.html'));
  });

};