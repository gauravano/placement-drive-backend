const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    department: String,
    rollno: Number,
    cgpa: Number
});

module.exports = mongoose.model('Student', studentSchema);