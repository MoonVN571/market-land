const axios = require("axios").default;
const crypto = require("crypto-js");
const { NAPTHE } = require('../../config.json');
module.exports = {
    name: "napthe",

    async execute (client, message, args) {
        // WHITELISt
        // if(message.guildId !== NAPTHE.GUILD_ID) return;

        if (!args[0] || !args[1] || !args[2] || !args[3]) return message.reply({allowedMentions: {repliedUser:false},content:"Bạn phải cung cấp cú pháp hợp lệ! Cách sử dụng: " + client.PREFIX + "napthe [Tên nhà mạng] [Mệnh giá] [Số Thẻ] [Số Seri]"});
        
        // let menhGiaList = [];
        // let cardList = [];

        // await axios({
        //     url: "http://dtsr11.com/api/cardrate?apikey=" + NAPTHE.API_KEY,
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Accept": "x-www-form-urlencoded"
        //     }
        // }).then(async callback => {
        //     let data = JSON.parse(callback.data);
        //     console.log(data?.Message);

        //     if(!data?.Data) return;
        //     await data?.Data.forEach(d => {
        //         if(!d.status) return;

        //         if(d.name.includes("Auto")) cardList.push(d.name.split(" ")[0]);
        //         else if(d.name.includes("Chậm")) cardList.push(d.name);
        //     });

        //     console.log(cardList)
        // }).catch(err => {
        //     // console.log(err);
        // });

        // const fetch = require('node-fetch');

        // await fetch("https://dtsr11.com/api/cardrate?apikey=" + NAPTHE.API_KEY, { method: 'get'})
        // .then(d => console.log(d))
        

        // return;
        if ((args[0] == "Viettel"
         || args[0] == "Mobifone" 
         || args[0] === "Vinaphone" 
         || args[0] === "Zing" 
         || args[0] === "Vietnamobile") === false) return message.reply({allowedMentions: { repliedUser:false}, content:"Cách loại thẻ hỗ trợ: \n- Viettel\n- Mobifone\n- Vinaphone\n- Zing\n- Vietnamobile\n- Vcoin\n\n**Chú ý:** Phải viết đúng hoa và viết thường"});
        
        if ((isNaN(parseFloat(args[1])) 
        || args[1] === '10000' 
        || args[1] === '20000' 
        || args[1] === '30000' 
        || args[1] === '50000' 
        || args[1] === '100000' 
        || args[1] === '200000'
        || args[1] === '300000'
        || args[1] === '500000') === false) return message.reply({allowedMentions:{repliedUser:false},content:"Mệnh giá nạp tiền không tồn tại"})
        
        if(isNaN(parseFloat(args[2])) || isNaN(parseFloat(args[3]))) return message.reply({allowedMentions:{repliedUser:false},content:"Mã thẻ hoặc seri không hợp lệ!"});
        
        switch(args[0]) {
            case "Viettel": type = 1
            break;

            case "Mobifone": type = 2
            break;

            case "Vinaphone": type = 3
            break;

            case "Vietnamobile": type = 16
            break;

            default: type = 0;
        }

        if(type == 0) return message.channel.send({allowedMentions:{repliedUser:false},content:"Không tìm thấy thẻ trên hệ thống thử lại sau!"});
        
        const input_string = JSON.stringify({
            author: message.author.tag,
            id: message.channel.id,
            timestamp: Date.now()
        });

        let crypt = crypto.AES.encrypt(input_string, NAPTHE.HASH_KEY).toString();

        let obj = {
            ApiKey: NAPTHE.API_KEY,
            Pin: args[2],
            Seri: args[3],
            CardType: type,
            CardValue: parseFloat(args[1]),
            requestid: crypt
        }

        console.log(obj);

        axios({
            method: "post",
            url: "http://dtsr11.com/api/card",
            headers:{
                "Content-Type": "application/json",
                "Accept": "x-www-form-urlencoded"
            },
            params: obj
        }).then(callback => {
            console.log(callback.data);
            message.channel.send(callback.data.Message);
            console.log(callback.data.Message);
        }).catch(err => {
            console.log(err);
            console.log(obj);
        });
    }
}