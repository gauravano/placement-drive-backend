const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    department: String,
    rollno: {
        type: Number,
        unique: true
    },
    cgpa: Number
});

module.exports = mongoose.model('Student', studentSchema);