module.exports = {
    name: "thongtinthanhtoan",
    aliases: ['tttt'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send({content:`
<a:kimcuong:883188235533156403> **THÔNG TIN THANH TOÁN** <a:kimcuong:883188235533156403> 

<a:tick:883188266403242015> CTK: NGUYEN MINH TRANG

<:logovietcombank:884639990796140544> Vietcombank: 1015944000
<:Logo_MB:884643617317199923> MB Bank: 0348118256
<:LogoMomo:884643756257722439> MoMo: 0348118256
<:zalopaylogo:884644430387232788> ZaloPay: 0348118256

**Lưu ý:** Thanh toán bằng <:owocash:895873427230035988> hoăc 🥑 thì give cho **<@857863782503153694>**
        `});
    }
}