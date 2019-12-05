var app = require('./server/server.js');
var mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;

// Set mongoURI
const mongoURI = "mongodb+srv://Admin:326isfun@userdb-gspl6.mongodb.net/LoanCalculator?retryWrites=true&w=majority";


mongoose.connect(mongoURI, { useNewUrlParser: true , useUnifiedTopology: true})
.catch(error => handleError(error))
// .then(res => console.log("Connected to DB"))
// .catch(err => console.log(err))


mongoose.connection.on('error', err => {
  console.log(err);
});



// Start the server on this port
let port = 7311;
app.listen(port);



//TEMP
var userHandler = require('./server/databases/user_data/userHandler.js');

// userHandler.temp("temp1");

// let temp_json_user = {
//   "username": "new_user1",
//   "password": "new_pass1",
//   "email": "new_email@new_email.com",
//   "monthly_payment": 500,
//   "projected_salary": 2000,
//   "total_debt": 1000000
// }

// errProm = userHandler.createUser(temp_json_user);
// errProm.then(() => {
//   console.log("Success.");
// })
// .catch(err =>{
//   console.log(err);
// })
// userHandler.testingPrintUser("new_user1");
