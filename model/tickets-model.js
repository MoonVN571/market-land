const mongoose = require('mongoose');
const schema = mongoose.Schema({
    guildId: String,
    channelId: String,
    messageId: String,

    tickets: { type: Array, default: []},
});
module.exports = mongoose.model("Tickets", schema);