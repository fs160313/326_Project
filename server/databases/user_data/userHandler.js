var User = require('./userModel.js');
const url = require('url');
const querystring = require('querystring');

module.exports = {

	createUser: function(req, res){
		let user = new User({
			...req.body
		});

    user.save(function(err, user){
      if (err){
        res.json({'status': 'failure', 'message': err});
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

  getData: function(req, res){
    // console.log(req.query.username);
		User.findOne({username: req.query.username}, function(err, user){
			if (user != null){
        console.log(user);
        res.json({'status': 'success', 'message': 'User found.', 'username': user.username, 'password': user.password, 'email': user.email, 'monthly_payment': user.monthly_payment })
			}
			else{
				res.json({'status': 'failure', 'message': 'User not found.'})
			}
		});
	},
};
