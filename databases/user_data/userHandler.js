var User = require('./userModel.js')

module.exports = {
	testingPrintUser: function(username){
		console.log(username);
		User.findOne({username: username}, function(err, user){
			console.log(user);
			if (user != null){
				console.log(user.username);
				console.log(user.password);
			}
			else{
				console.log("User not found.");
			}
		});
	},

	createUser: function(username, password, email){
		console.log('made it here2');
		console.log(username);
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
		
		 
		// User.findOne({username: username}, function(err, user){
		// 	console.log(user);
		// 	// if (user != null && user.password == pass){
		// 	// 	console.log("matched password.");
		// 	// 	res.json({'status': 'success', 'redirect':'/shoppinglist.html'});
		// 	// }
		// 	// else{
		// 	// 	res.json({'status': 'failure'});
		// 	// }
		// 	if (user != null){
		// 		console.log(user.username);
		// 		console.log(user.password);
		// 	}
		// 	else{
		// 		console.log("User not found.");
		// 	}
			
		// });
	}
};
