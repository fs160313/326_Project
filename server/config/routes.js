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
  //app.delete('/loan', loanHandler.deleteLoan) 

  //routes for user endpoints
  app.post('/user', userHandler.createUser) //done
  app.put('/user', userHandler.modifyUser) //done
  app.delete('/user', userHandler.deleteUser) //done

  app.get('/user', userHandler.getData) //done

  let path = require('path');
  app.get('/create_account', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../create_account.html'));
  });
  
  app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../index.html'));
  })

  app.post('/calculate', (req, res) => {
    if (!req.body.monthly_payment){
      res.json({'status': 'failure', 'error': 'monthly_payment'});
    }
    grad_date_split = (req.body.grad_date).split(' ')
    if (grad_date_split[1] === ''){
      res.json({'status': 'failure', 'error': 'grad_date'});
    }
    const { spawn } = require('child_process');
    let data = ((JSON.stringify(req.body)).toString())
    const pyProg = spawn('python3', [path.join(__dirname + '/../calc.py'), data]);
    pyProg.stdout.on('data', function(data) {
        res.json(JSON.parse(data))
    });
  });

};