const axios = require("axios").default;
const { NAPTHE } = require('../../config.json');
module.exports = {
    name: "chietkhau",
    aliases: ['ck'],

    async execute(client, message, args) {
        if(!args[0]) return message.reply({content: "Cung cấp mệnh giá cần xem, có thể nhầm nhiều mệnh giá.", allowedMentions: { repliedUser: false }});

        let menhGia = args;

        let c = false;
        menhGia.forEach(d => {
            if(!c && isNaN(d)) {
                c = true;
                message.reply({content: "Mệnh giá cung cấp không hợp lệ.", allowedMentions: { repliedUser: false }});
            } else {
                if ((isNaN(parseFloat(d)) 
                || d === '10000' 
                || d === '20000' 
                || d === '30000' 
                || d === '50000' 
                || d === '100000' 
                || d === '200000'
                || d === '300000'
                || d === '500000') === false) c = true;
        
            }
        });

        if(c) return;

        axios.get('https://dtsr11.com/api/cardrate?apikey=' + NAPTHE.API_KEY).then(d => {
            if(d.data.Code !== 1) return message.reply({content: "Web trả về mã code không hợp lệ!", allowedMentions: { repliedUser: false }});

            try {
                let cardField = [];

                d.data.Data.forEach(async d => {
                    if(d.status) {
                        let price = [];
                        await d.prices.forEach(d => {
                            if(d.status && menhGia.indexOf(d.price.toString()) > -1) price.push(Intl.NumberFormat().format(d.price) + " VNĐ (" + d.rate + "%)\n");
                        });

                        cardField.push({
                            name: d.name,
                            value: price != "" ? price.join(" ") : "Không có",
                            inline: true
                        });
                    }
                });
                setTimeout(() => {
                    message.reply({ embeds: [{
                        title: "BẢNG PHÍ",
                        fields: cardField,
                        color: "BLUE"
                    }], allowedMentions: { repliedUser: false }});
                }, 1000);
            } catch(e) {
                message.reply({content: "Web lấy thông tin gặp vấn đề thử lại sau!", allowedMentions: { repliedUser: false }});
            }

        }).catch(err => {
            console.log(err);
            message.reply({content: "Web lấy thông tin gặp vấn đề thử lại sau!", allowedMentions: { repliedUser: false }});
        });
    }
}