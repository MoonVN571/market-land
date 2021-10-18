const db = require('../../model/regex-model');
module.exports = {
    name: "auto-response",
    aliases: ['ar', 'autorespon', 'auto-resond', 'autor'],

    async execute(client, message, args) {
        if(!args[0]) return message.reply({allowedMentions:{repliedUser:false}, content:"Cung cấp kí tự phản hồi và dữ liệu phản hồi!"});
        if(!args[1]) return message.reply({allowedMentions:{repliedUser:false}, content:"Cung cấp dữ liệu phản hồi!"});
        
        let textData = await db.findOne({ guildId: message.guildId });
                
        if(!textData) await db.create({ guildId: message.guildId, data: Array });
        textData = await db.findOne({ guildId: message.guildId });
        
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
                console.log("dieu kien")
            } else {
                newData.push(d);
            }
        });

        if(news){
            textData.data = newData;
            await textData.save();
            message.reply({content: "Thay thế **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
            return;
        }

        await textData.data.push({
            content: args[0],
            reply: args.slice(1).join(" ")
        });

        textData.save();

        message.reply({content: "Đặt **" + args[0] + "** với nội dung:\n" + args.slice(1).join(" "), allowedMentions:{repliedUser:false}});
    }
}