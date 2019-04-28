const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true    
    },
    description: String,
    numVacancies: Number
});

module.exports = mongoose.model('Company', companySchema);