const mongoose = require('mongoose');
const schema = mongoose.Schema({
    backupId: String,
    data: { type: Object, default: {} },
});
module.exports = mongoose.model("Backups", schema);