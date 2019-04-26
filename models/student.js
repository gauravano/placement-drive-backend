const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    department: String,
    rollno: Number,
    cgpa: Number
});

module.exports = mongoose.model('Student', studentSchema);