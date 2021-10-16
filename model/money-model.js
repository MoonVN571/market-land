const mongoose = require('mongoose');
const schema = mongoose.Schema({
    balance: { type: Number, default: 0 },
    guildId: { type: String, default: undefined}
});
module.exports = mongoose.model("DTSR", schema);