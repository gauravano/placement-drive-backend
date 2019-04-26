const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    department: String,
    rollno: Number,
    cgpa: Number
});

module.exports = mongoose.model('Company', companySchema);