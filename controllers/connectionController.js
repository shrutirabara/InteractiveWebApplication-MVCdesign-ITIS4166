const { promiseImpl } = require('ejs');
const { nextTick } = require('process');
const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');
const user = require('../models/user');


exports.index = (req, res, next)=>{
    //res.send('send all connections');
    model.find()
    .then(connections=>res.render('./connection/index', {connections}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./connection/new');
};

exports.create = (req, res, next)=>{
    //res.send('Created a new connection');
    let connection = new model(req.body);
    connection.host = req.session.user;
    connection.save()
    .then(connection=> res.redirect('/connections'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    let user = req.session.user;
    
    Promise.all([model.findById(id).populate("host", "firstName lastName"), rsvpModel.count({connection:id, rsvp:"YES"})])
    
    .then(results=>{
        const [connection, rsvps] = results;
        if(connection) {
            return res.render('./connection/show', {connection, user, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(connection=>{
        if(connection) {
            res.render('./connection/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection)
            res.redirect('/connections/' + id);
        else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err); 
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
   
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), rsvpModel.deleteMany({connection:id})])
    .then(connection=>{
        if(connection){
            req.flash('success', 'Successfully deleted connection and associated RSVPs');
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err); 
        }
    })
    .catch(err=>next(err));
};

exports.editRsvp = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({connection:id, user:req.session.user}).then(rsvp=>{
        if(rsvp) {
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp=>{
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                console.log(err);
                if(err.name === 'ValidationError') {
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            });

        } else {
            //create
            let rsvp = new rsvpModel({
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Successfully created RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                req.flash('error', err.message);
                next(err)});
        }
    })
};

exports.deleteRsvp = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection:id})
    .then(rsvp=>{
        req.flash('success', 'Successfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err)
    });
}
