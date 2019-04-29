const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true    
    },
    description: {
        type: String
    },
    numVacancies: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Company', companySchema);