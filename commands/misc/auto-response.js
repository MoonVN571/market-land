const db = require('../../model/regex-model');
module.exports = {
    name: "auto-response",
    aliases: ['ar', 'autorespond', 'auto-resond', 'autor'],

    async execute(client, message, args) {
        if(!args[0]) return message.reply({allowedMentions:{repliedUser:false}, content:"Cung cấp kí tự phản hồi và dữ liệu phản hồi!"});
        // if(!args[1]) return message.reply({allowedMentions:{repliedUser:false}, content:"Cung cấp dữ liệu phản hồi!"});
        
        let textData = await db.findOne({ guildId: message.guildId });
                
        if(!textData) await db.create({ guildId: message.guildId, data: Array });
        textData = await db.findOne({ guildId: message.guildId });
        
        if(args[0] == "list") {
            let dataList = [];
            await textData?.data.forEach(d => {
                dataList.push(d.content);
            });

            setTimeout(() => {
                message.reply({
                    embeds: [{
                        title: "Phản hồi của " + message.guild.name,
                        color: "GREEN",
                        description: dataList.join("\n"),
                        timestamp: new Date()
                    }], allowedMentions: { repliedUser: false }
                })
            }, 200);
            return;
        }

        if(args[0] == "del" || args[0] == "delete") {
            let data = await textData.data.filter(d => d.content == args[1]);

            if(!data || data.length < 1) return message.reply({content: "Không tìm thầy respond này", allowedMentions: {repliedUser: false}});

            textData.data = await textData.data.filter(d=>d.content!==args[1]);
            await textData.save();

            message.reply({
                content: "Đã xoá respond tên **" + args[1] + "**.",
                allowedMentions: { repliedUser: false }
            });

            return;
        }

        if(!args[1]) {
            let data = await textData.data.filter(d => d.content == args[0]);

            if(!data || !data[0]?.reply) return message.reply({content: "Không tìm thầy respond này", allowedMentions: {repliedUser: false}});
            message.reply({
                content: data[0].reply,
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        // Check old respond able
        let checkRespond = await textData.data.filter(d=>d.content==args[0]);

        if(checkRespond.length > 0) {
            let newRespond = await textData.data.filter(d=>!d.content==args[0]);

            let newData = {
                content: args[0],
                reply: args.slice(1).join(" ")
            };
            newRespond.push(newData);
            textData.data = newRespond;

            await textData.save();
            
            message.reply({content: "Đã thay thế **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
            return;
        }

        await textData.data.push({
            content: args[0],
            reply: args.slice(1).join(" ")
        });

        textData.save();

        message.reply({content: "Đã tạo respond mới tên **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
    }
}