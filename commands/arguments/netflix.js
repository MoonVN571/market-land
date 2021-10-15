module.exports = {
    name: "netflix",
    aliases: ['net'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
<:netflixlogo:883008576086478889> BẢNG GIÁ NETFLIX <:netflixlogo:883008576086478889>
<a:tick:883188266403242015> NETFLIX PREMIUM 4K ULTRA HD <a:tick:883188266403242015>
> <a:tickxanh:898401565872893962>  Netflix 1 tháng - 1 người dùng - 40k VNĐ/1m8<a:owo:895874259132510269>/🥑 
> <a:tickxanh:898401565872893962>  Netflix 2 tháng - 1 người dùng - 80k VNĐ/3m6 <a:owo:895874259132510269>/🥑 
> <a:tickxanh:898401565872893962>  Mua từ 3 tháng trở lên: 35.000 x số tháng
        `);
    }
}