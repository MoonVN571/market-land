module.exports = {
    name: "boost",
    aliases: ['boost'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
<:boost:898496628049182740> ** THANH TOÁN ** <:boost:898496628049182740> 

> <a:tick:883188266403242015> **1 boost/tháng 35k - 2m <a:owo:895874259132510269>/🥑**
Sẽ update giá nếu mua số lượng lớn sau..

<:boost:898496628049182740> ** THÔNG TIN VỀ BOOSTER ** <:boost:898496628049182740> 

<a:tick:883188266403242015> **Yêu cầu:**
> 🔸 Bên mình sẽ cần link server bạn cần boost, bên mình sẽ vào và boost cho bạn.
        `);
    }
}