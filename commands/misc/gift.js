const {getRandom}= require('../../utils');
const user = require('../../model/gift-model');
module.exports = {
    name: "gift",
    default: true,
    
    async execute(client, message, args) {
        if(new Date().getTime('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh'}) > 1634515200000) {
            message.channel.send("Event đã kết thúc!").then(m=>setTimeout(()=>{if(m.deletable) m.delete()}, 5000));
            if(message.deletable) message.delete();
            return;
        }

        let data = await user.findOne({ userId: message.author.id });
        if(!data) await user.create({ userId: message.author.id, claimedAt: Date.now()});

        data = await user.findOne({ userId: message.author.id });

        let timeCd = getMS(data.claimedAt - Date.now());
        if(data.claimedAt - Date.now() > 0)
            return message.reply({ allowedMentions: { repliedUser: false }, content: "Bạn đã nhận quà rồi, vui lòng chờ trong **" + timeCd  + "** để tiếp tục sử dụng lệnh!" })
            .then(msg => setTimeout(() => { if(msg.deletable) msg.delete()}, 10000));
        
        try {
            data.claimedAt = Date.now() + 1 * 60 * 60 * 1000;
            data.save();
        } catch(e) {
            console.log(e);
        }
        
        return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/mayman.png']});
    }
}


function getMS(tick) {
    let time = tick / 1000;

    let min = parseInt(time / 60);
    let sec = parseInt(time - (min * 60));

    let str = "";
    if(min > 0) str = sodep(min, 2) + "M";
    if(sec > 0) str = str + " " + sodep(sec, 2) + "S";

    return str.trim();
}

function sodep (value, length) {
    return `${value}`.padStart(length, 0);
}
