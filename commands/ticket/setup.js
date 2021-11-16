const { Client, Message, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const tickets = require('../../model/tickets-model');
module.exports = {
    name: "setup",
    description: "Setup ticket cho server",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async execute (client, message, args) {
        // luu current channel or tag channel
        let channelId = message.channelId;
        if(message.mentions.channels.first()) channelId = message.mentions.channels.first().id;

        let channel = message.guild.channels.cache.get(channelId);
        let compo = new MessageActionRow()
            .addComponents( /*
                new MessageSelectMenu()
                    .addOptions(
                        {
                            label: "Mua Hàng",
                            description: "Cho bạn xem các lựa chọn sản phẩm để mua",
                            emoji: "✨",
                            value: "1",
                            default: false
                        },
                        {
                            label: "Hỗ Trợ",
                            description: "Các Helper sẽ hỗ trợ bạn giải quyết vấn đề",
                            emoji: "🎃",
                            value: "2",
                            default: false
                        }
                    )
                    .setCustomId(channelId)
                    .setPlaceholder("Lựa chọn thông thông bạn muốn:")
                    .setMinValues(1)
                    .setMaxValues(1) */
            );
        let data = await tickets.findOne({ channelId: channelId });
        if(data) return message.reply({content: "Không thể tạo thêm ticket", allowedMentions: { repliedUser: false }});
        
        if(!data) data = await tickets.create({ channelId: channelId, messageId: String, tickets: { type: Array, default: []} });

        data.channelId = channelId;
        data.guildId = message.guildId;

        channel.send({
            embeds: [{
                author: {
                    name: "Hỗ trợ ẩn danh / Tư vấn mua bán",
                },
                description: "Bấm 📩 để tạo ticket cho bạn",
                color: "GREEN",
            }]
        }).then(async m => {
            data.messageId = m.id;
            await data.save();
            
            require('../../tickets/sync')(m);
        });
    }
}