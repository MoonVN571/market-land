
// DISCORD - BACKUP
const backup = require("discord-backup");
const backupDb = require('../../model/backups-model');

module.exports = {
    name: "backup",
    
    async execute(client, message, args) {
        if(args[0] == "new") {
            await backup.create(message.guild, {
                maxMessagesPerChannel: 1000,
                jsonSave: false,
                jsonBeautify: true,
                doNotBackup: [],
                saveImages: "base64"
            }).then(async (backupData) => {
                console.log(backupData.id);

                let db = await backupDb.findOne({ backupId: backupData.id });
                if(!db) await backupDb.create({ backupId: backupData.id, data: backupData });
            
                message.author.send(backupData.id + ", đây là id backup của bạn!").catch(console.error);
                message.channel.send("Đã backups thành công!");
            });
        }

        if(args[0] == "load") {
            if(!args[1]) return message.reply("Backups không hợp lệ!");
            let db = await backupDb.findOne({ backupId: args[1] });
            if(!db) return message.channel.send("Không tìm thấy backups này!");
            
            backup.load(db.data, message.guild).then(() => {
                console.log("Done!");
            });
        }
    }
}