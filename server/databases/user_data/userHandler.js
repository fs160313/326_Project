var User = require('./userModel.js');

module.exports = {
	testingPrintUser: function(username){
		console.log(username);
		User.findOne({username: username}, function(err, user){
			console.log(user);
			if (user != null){
				console.log(user.username);
        console.log(user.password);
        console.log(user.email);
        console.log(user.monthly_payment);
			}
			else{
				console.log("User not found.");
			}
		});
	},

	createUser: function(user_json){
    console.log(user_json)
		console.log('made it here2');
		var user = new User({
			...user_json
		});
    // console.log(user);

    // Returning a promise here
    return user.save()
		
		 
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
