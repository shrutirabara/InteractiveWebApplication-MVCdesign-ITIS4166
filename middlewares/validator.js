const {body} = require('express-validator');
const {validationResult} = require('express-validator');



exports.validateId = (req, res, next) => {
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Not a valid ObjectID type value');
        err.status = 400;
        next(err);
    }
};

exports.validateRsvp = [body('rsvp').isIn(['YES', 'NO', 'MAYBE'])];

exports.validateSignUp = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
        if(!errors.isEmpty()) {
            errors.array().forEach(error=>{
                req.flash('error', error.msg);
            });
            return res.redirect('back');
        } else {
            return next();
        }
}
exports.validateConnection = [body('title', 'Cannot be empty').notEmpty().trim().escape(),
body('details', 'Cannot be empty and should be atleast 10 characters').notEmpty().trim().escape().isLength({min: 10}),
body('topic', 'Cannot be empty').notEmpty().trim().escape(),
body('location', 'Cannot be empty').notEmpty().trim().escape(),
body('imageURL', 'Cannot be empty').notEmpty().trim().escape(),
body('startTime', 'Cannot be empty').notEmpty().trim().escape(),
body('endTime', 'Cannot be empty').notEmpty().trim().escape(),
body('date', 'Cannot be empty').notEmpty()]; 

