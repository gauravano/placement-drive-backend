const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: String,
    rollno: {
        type: Number,
        unique: true, 
        required: true
    },
    cgpa: Number
});

module.exports = mongoose.model('Student', studentSchema);