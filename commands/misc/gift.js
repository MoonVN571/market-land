const {getRandom}= require('../../utils');
const user = require('../../model/gift-model');
const { WHITELIST_CMDS } = require('../../config.json');
module.exports = {
    name: "gift",
    default: true,
    
    async execute(client, message, args) {
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

        let rd = getRandom(0, 10000);
        if(WHITELIST_CMDS.indexOf(message.author.id) > -1 && rd > 5000 && rd <= 7999) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/nitroboost.png']});

        /*
        if(rd > 1 && rd <= 905) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/mayman.png']});
        if(rd > 905 && rd <= 919) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/nitroclassic.png']});
        if(rd > 919 && rd <= 920) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/nitroboost.png']});
        if(rd > 920 && rd <= 960) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/rd200.png']});
        if(rd > 960 && rd <= 980) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/spotify.png']});
        if(rd > 980 && rd <= 1000) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/netflix.png']});
        */
        if(rd > 0 && rd <= 5300) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/mayman.png']});
        if(rd > 5300 && rd <= 5310) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/nitroclassic.png']});
        if(rd > 5310 && rd <= 5311) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/nitroboost.png']});
        if(rd > 5311 && rd <= 8311) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/rd200.png']});
        if(rd > 8311 && rd <= 8811) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/spotify.png']});
        if(rd > 8811 && rd <= 10000) return message.reply({ allowedMentions: { repliedUser: false }, files: ['./image/netflix.png']});
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
