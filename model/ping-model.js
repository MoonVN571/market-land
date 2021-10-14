const mongoose = require('mongoose');
const schema = mongoose.Schema({
    data: String,
    start: {type:Number, default: null},
});
module.exports = mongoose.model("Client", schema);