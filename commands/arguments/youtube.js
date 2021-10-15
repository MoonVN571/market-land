module.exports = {
    name: "youtube",
    aliases: ['yt'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
        
        <:youtubelogo:883188558792388648> BẢNG GIÁ YOUTUBE PREMIUM <:youtubelogo:883188558792388648>
        <a:tick:883188266403242015> 3 tháng - 110.000 VNĐ
        <a:tick:883188266403242015> 4 tháng - 140.000 VNĐ
        <a:tick:883188266403242015> 6 tháng - 200.000 VNĐ
        <a:tick:883188266403242015> 12 tháng - 400.000 VNĐ
        `);
    }
}