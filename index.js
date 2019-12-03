// var app = require('./server/server.js');
var mongoose = require('mongoose');

// mongoose.Promise = global.Promise

//TEMP
var userHandler = require('./databases/user_data/userHandler.js');


// Set mongoURI
const mongoURI = "mongodb+srv://Indo:326issofun@userdb-gspl6.mongodb.net/LoanCalculator?retryWrites=true&w=majority";


mongoose.connect(mongoURI, { useNewUrlParser: true , useUnifiedTopology: true})
.catch(error => handleError(error))
// .then(res => console.log("Connected to DB"))
// .catch(err => console.log(err))


mongoose.connection.on('error', err => {
  console.log(err);
});

// userHandler.temp("temp1");

userHandler.createUser("new_user1", "new_pass1", "new_email@new_email.com");
userHandler.testingPrintUser("new_user1");
