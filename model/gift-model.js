const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userId: String,
    claimedAt: { type: Number, default: 0 },
});
module.exports = mongoose.model("Gifting", schema);