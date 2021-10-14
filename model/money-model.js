const mongoose = require('mongoose');
const schema = mongoose.Schema({
    balance: { type: Number, default: 0 },
});
module.exports = mongoose.model("DTSR", schema);