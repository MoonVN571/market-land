const balance = require('../../model/money-model');
const {NAPTHE} = require('../../config.json');
module.exports = {
    name : "balance",
    aliases: ['bal'],

    async execute(client, message, args) {
        let bal = await balance.findOne({ guildId: NAPTHE.GUILD_ID });
        if(!bal) await balance.create({ guldId: NAPTHE.GUILD_ID, balance: 0 });
        bal = await balance.findOne({ guldId: NAPTHE.GUILD_ID });

        let bankMoney = Intl.NumberFormat().format(bal.balance ? bal.balance : 0);

        message.reply({embeds:[{
            title: "QUỸ SERVER",
            description: "**Tiền Bank**: " + bankMoney + " VNĐ",
            timestamp: new Date(),
            color: "AQUA"
        }], allowedMentions: { repliedUser: false }});
    }
}