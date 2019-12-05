var User = require('./userModel.js');
const url = require('url');
const querystring = require('querystring');

module.exports = {

	createUser: function(req, res){
    // console.log(req.body)
		// console.log('made it here2');
		let user = new User({
			...req.body
		});
    // console.log(user);

    // Returning a promise here
    user.save(function(err, user){
      if (err){
        res.json({'status': 'failure', 'message': err})
      }
      else{
        res.json({'status': 'success', 'message': 'User with id: ' + user._id + ' saved.'});
      }
    });
  },
  
  modifyUser: function(req, res){
    console.log(req.body.updates);
    User.updateOne({'_id': req.body._id}, ...req.body.updates, function(err, user){
      if (err){
        res.json({'status': 'failure', 'message': err});
      }
      else{
        res.json({'status': 'success'});
      }
    });
  },

  deleteUser: function(req, res){
    User.deleteOne({'_id': req.body._id}, function(err, user){
      if (err){
        res.json({'status': 'failure', 'message': err});
      }
      else{
        res.json({'status': 'success'});
      }
    });
  },

  verify: function(req, res){
    console.log(req.query.username);
		User.findOne({username: req.query.username}, function(err, user){
			if (user != null){
        res.json({'status': 'success', 'message': 'User found.', 'password': user.password})
			}
			else{
				res.json({'status': 'failure', 'message': 'User not found.'})
			}
		});
	},
};
