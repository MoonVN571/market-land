const axios = require("axios").default;
const crypto = require("crypto-js");
const { NAPTHE } = require('../../config.json');
module.exports = {
    name: "napthe",

    async execute (client, message, args) {
        // return message.reply({content: "Hosting không hỗ trợ method này", allowedMentions: { repliedUser: false }});

        if (!args[0] || !args[1] || !args[2] || !args[3]) return message.reply({allowedMentions: {repliedUser:false},content:"Bạn phải cung cấp cú pháp hợp lệ! Cách sử dụng: " + client.PREFIX + "napthe [Tên nhà mạng] [Mệnh giá] [Số Thẻ] [Số Seri]"});
        
        if ((isNaN(parseFloat(args[1]))
        || args[1] === '10000'
        || args[1] === '20000'
        || args[1] === '30000'
        || args[1] === '50000'
        || args[1] === '100000'
        || args[1] === '200000'
        || args[1] === '300000'
        || args[1] === '500000') === false) return message.reply({allowedMentions:{repliedUser:false},content:"Mệnh giá nạp tiền không tồn tại"})
        
        switch(args[0].toLowerCase()) {
            case "viettel" || "vt": type = 1
            break;

            case "mobifone" || "mobi": type = 2
            break;

            case "vinaphone" || "vina": type = 3
            break;

            case "vietnamobile" || "vnmobile" || "vnm": type = 16
            break;

            case "zing": type = 14
            break;

            case "gate": type = 15
            break;

            case "vcoin": type = 22
            break;

            case "garena": type = 25
            break;

            default: type = 0;
        }

        if(type == 0) return message.channel.send({allowedMentions:{repliedUser:false},content:"Không tìm thấy thẻ trên hệ thống thử lại sau!"});
        
        if(isNaN(parseFloat(args[2])) || isNaN(parseFloat(args[3]))) return message.reply({allowedMentions:{repliedUser:false},content:"Mã thẻ hoặc seri không hợp lệ!"});
        
        const input_string = JSON.stringify({
            author: message.author.tag,
            id: message.channel.id,
            timestamp: Date.now()
        });

        let crypt = crypto.AES.encrypt(input_string, NAPTHE.HASH_KEY).toString();

        let obj = {
            ApiKey: NAPTHE.NAP_CARD,
            Pin: args[2],
            Seri: args[3],
            CardType: type,
            CardValue: parseFloat(args[1]),
            requestid: crypt
        }

        axios({
            url: "https://dtsr11.com/api/card",
            method: "post",
            headers:{
                "Content-Type": "application/json",
                "Accept": "x-www-form-urlencoded"
            },
            params: obj
        }).then(callback => {
            // console.log(callback.data);
            // if(callback.data.Code == 0) return message.channel.send("Hệ thống lỗi, hãy kiểm tra lại thẻ cào (`" + PREFIX + "ck <Mệnh Giá>`)!");
            message.channel.send(callback.data.Message);
        }).catch(err => {
            console.log(err);
            console.log(obj);
        });
    }
}