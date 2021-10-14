const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const Database = require('simplest.db');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
const { TOKEN, USER_ID, WHITELIST_CMDS, PREFIX, CHANNEL_NOTIFY, MONGO_STRING } = require('./config.json');

client.commands = new Collection();
client.PREFIX = PREFIX;

// MONGO
const mongoose = require('mongoose');

mongoose.connect(MONGO_STRING).then(() => {
    console.log("Connected to databases!");
    client.login(TOKEN, console.error);
});

require('./napthe-api');

module.exports.discord = client;

readdirSync('./commands/').forEach(dir => {
    readdirSync('./commands/' + dir + "/").forEach(pull => {
        const cmd = require(`./commands/${dir}/${pull}`);
        if(cmd.name) {
            client.commands.set(cmd.name, cmd);
            console.log("LOAD " + cmd.name)
        } else console.log(pull + " -> Thiếu cmd.name");
    });
});

client.on('ready', () => {
    console.log("Main ready!");

    client.user.setActivity("Market Land", {type: "WATCHING"});
});

client.on('channelCreate', channel => {
    if(channel.name.startsWith("ticket-")) {
        client.users.fetch(USER_ID).then(u => u.send(channel.name + " - New ticket!").catch(console.error)).catch(console.error);
    }
});

client.on('messageCreate', async message => {
    if(!message || !message.channel || !message.guild || message.author.bot) return;
    if(message.author.id !== USER_ID && (CHANNEL_NOTIFY.indexOf(message.channelId) > -1
    || message.channel.name.startsWith("ticket-"))) client.users.fetch(USER_ID).then(u => u.send(message.channel.toString() + " | *" + message.author.tag + "* SAID: " + message.content + (message.attachments.first() ? message.attachments.map(m => m?.proxyURL) : "")).catch(console.error));

    if(message.content.startsWith("#invites")) console.log("[" + new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh'}) + "] " + message.author.tag + " | " + message.content);

    if(!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if(!cmd) return;
    if(cmd.delete && message.deletable) message.delete();

    if(message.author.id !== USER_ID && !cmd.default && WHITELIST_CMDS.indexOf(message.author.id) < 0) return;

    if(cmd.name == "gift" && !message.member.roles.cache.some(r => r.id === "896426505272447087"))
        return message.reply({content: "Bạn chưa đủ điều kiện nhận quà, hãy mời **5 người** vào server và ping HELPER hoặc FOUNDER để được cấp roles tại kênh **<#896747520158486580>**!", allowedMentions: {repliedUser: false}})
        .then(m => setTimeout(() => {if(m.deletable) m.delete()}, 5 * 1000));
    
    cmd.execute(client, message, args);
});