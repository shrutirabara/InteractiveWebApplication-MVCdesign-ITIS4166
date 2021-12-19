const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const connectionScheme = new Scheme({
    title: {type: String, required: [true, 'title is required']},
    host: {type: Scheme.Types.ObjectId, ref:'User'},
    details: {type: String, required: [true, 'details is required'], 
        minLength: [10, 'the details should have atleast 10 characters']},
    topic: {type: String, required: [true, 'topic is required']},
    location: {type: String, required: [true, 'location is required']},
    imageURL: {type: String, required: [true, 'imageURL is required']},
    startTime: {type: String, required: [true, 'start time is required']},
    endTime: {type: String, required: [true, 'end time is required']},
    date: {type: String, required: [true, 'date is required']}

},
);

module.exports =  mongoose.model('Collection', connectionScheme);






