const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    rut: {
        type: String,
        required: true
    },
    timeStamp:{
        type: Number,
        required: true

    }
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;