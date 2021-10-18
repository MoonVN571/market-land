const mongoose = require('mongoose');
const schema = mongoose.Schema({
    guildId: String,
    data: Array
});
module.exports = mongoose.model("Regex", schema);