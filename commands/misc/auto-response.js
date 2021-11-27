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
                        title: "Danh sách Auto Response",
                        color: "GREEN",
                        description: dataList.join("\n"),
                        timestamp: new Date()
                    }], allowedMentions: { repliedUser: false }
                })
            }, 1000);
            return;
        }

        if(!args[1]) {
            let data = await textData.data.filter(d => d.content == args[0]);

            if(!data || !data[0]?.reply) return message.reply({content: "Không có bất kì content nào ở respond này", allowedMentions: {repliedUser: false}});
            message.reply({embeds: [{
                title: "Nội dung của " + args[0],
                description: data[0].reply,
                color: "GREEN",
                timestamp: new Date()
            }], allowedMentions: { repliedUser: false }});
            return;
        }

        let newData= [];

        let news = false;
        await textData?.data.forEach(async d => {
            if(d.content.includes(args[0])) {
                let a = {
                    content: args[0],
                    reply: args.slice(1).join(" ")
                };
                newData.push(a);
                news = true;
            } else {
                newData.push(d);
            }
        });

        if(news){
            textData.data = newData;
            await textData.save();
            message.reply({content: "Đã thay thế **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
            return;
        }

        await textData.data.push({
            content: args[0],
            reply: args.slice(1).join(" ")
        });

        textData.save();

        message.reply({content: "**Đã tạo respond mới tên **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
    }
}