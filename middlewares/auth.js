const Connection = require('../models/connection');

//check if user is guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authencitaed
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is the author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.host == req.session.user) {
                return next();
            } else  {
                let err = new Error('unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
         }
    })
    .catch(err=>next(err));
};

exports.isNotAuthor = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.host != req.session.user) {
                console.log('isNotAuthor');
                return next();
            } else  {
                let err = new Error('unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
         } 
    })
    .catch(err=>next(err));
};