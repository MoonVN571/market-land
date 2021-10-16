const crypto = require("crypto-js")
const express = require("express")
const app = express.Router()
const client = require("./index").discord;
const { NAPTHE } = require('./config.json');
const balance = require('./model/money-model');
app.post("/", async function (req, res) {
    let data = req.body
    let cb 
    try {
       cb = JSON.parse(crypto.AES.decrypt(req.body.requestid, NAPTHE.HASH_KEY).toString(crypto.enc.Utf8));
    } catch (err) {
        console.log("Không thể giải mã chuối Callback");
        return res.json({status:"Thất bại", msg:"Không thể giải mã chuỗi content"});
    }

    let taskID = data.TaskId;
    let maThe = data.Pin;
    let seriThe = data.Seri;
    let real_price = data.amount;
    let input_price = data.declared_value;

    let bal = await balance.findOne({ });
    if(!bal) await balance.create({money: 0 });
    bal = await balance.findOne({ });

    bal.money += real_price - 2000;
    bal.save();

    res.send({Status:"Thành công", Message: "Đã trả về hệ thống"});

    if(!client.channels.cache.get(cb.id)) return console.log("Unknown channel to send card status");
    client.channels.cache.get(cb.id).send({embeds: [{
        author: {
            name: "THÔNG TIN TRẢ VỀ - " + taskID
        },
        footer:{
            text: "dtsr11.com - API"
        },
        fields: [
            {
                name: "Số Seri",
                value: seriThe,
                inline: true
            },
            {
                name: "Mã Thẻ",
                value: maThe,
                inline: true
            },
            {
                name: "Mệnh Giá",
                value: Intl.NumberFormat().format(input_price) + "VNĐ",
                inline: true
            },
            {
                name: "Nhận Được",
                value: Intl.NumberFormat().format(parseInt(real_price - 2000)) + "VNĐ",
                inline: false
            },
            {
                name: "Trạng thái",
                value: (data.Success ? "Gạch thành công!" : "Thẻ lỗi!"),
                inline: true
            },
            {
                name: "Người Gửi",
                value: cb.author,
                inline: true
            }
        ],
        color: (data.Success ? "GREEN" : "RED"),
        timestamp: new Date(),
        
        
    }]});
});

module.exports.route = app;