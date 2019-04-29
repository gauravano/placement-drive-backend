const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    rollno: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Registration', registrationSchema);