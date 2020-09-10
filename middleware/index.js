//all the middleware goes here
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				console.log('Error');
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					console.log('Error');
					req.flash('error', 'You dont have persision');
					res.redirect('back');
				}
			}
		});
	} else {
		console.log('Error');
		req.flash('error', 'You need to be logged in');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				console.log(err);
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					console.log('Error');
					req.flash('error', 'You dont have permission to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		console.log('Error');
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log('Error');
	req.flash('error', 'You need to be logged in');
	res.redirect('/login');
};

module.exports = middlewareObj;
