const mongoose = require('mongoose');
const schema = mongoose.Schema({
    guildId: { type: String, default: undefined},
    balance: { type: Number, default: 0 },
    rose: { type: Number, default: 0}
});
module.exports = mongoose.model("DTSR", schema);