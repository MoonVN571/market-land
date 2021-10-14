const data = require('../../model/ping-model');
module.exports = {
    name :"ping",

    async execute(client, message, args) {
        const db = await data.findOne({ data: "ping" });

        async function getPing() {
            const write = await getWrite();
            const read = await getRead();
            const average = (read + write) / 2;
            // db.delete("LQ==").catch(() => null);
            try {
                await data.deleteOne({data:"ping"});
            } catch(e) {}
            return { read, write, average };
        }

        async function getRead() {
            const start = Date.now();
            await data.findOne({data: "ping" });
            return Date.now() - start;
        };
        
        async function getWrite() {
            const start = Date.now();
            await data.create({data: "ping", start: Math.floor(Math.random() * 100000) });
            
            return Date.now() - start;
        };
        
        let mongoDelay = await getPing();

        message.channel.send("Đang kiểm tra ping...").then(msg => {
            msg.delete();
            message.reply({content: "Bot Ping: " + (msg.createdAt - message.createdAt) + " ms.\nClient Ping: " + client.ws.ping + " ms.\n\nMongo Ping: \n  Read: " + mongoDelay.read + " ms.\n  Write: " + mongoDelay.write + " ms.\n  Average: " + mongoDelay.average + " ms.", allowedMentions: { repliedUser: false }});
        });
    }
}