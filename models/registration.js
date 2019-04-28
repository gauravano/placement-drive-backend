const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    companyName: String,
    rollno: Number    
});

module.exports = mongoose.model('Registration', registrationSchema);