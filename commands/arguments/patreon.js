module.exports = {
    name: "patreon",
    aliases: ['pa'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
        Tạm thời chưa có mặt hàng liên quan đến Patreon
        `);
    }
}