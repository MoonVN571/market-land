const { Client, Intents, Collection, MessageActionRow, MessageButton } = require('discord.js');
const { readdirSync } = require('fs');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
});
const { USER_ID, WHITELIST_CMDS, PREFIX, CHANNEL_NOTIFY, DEV } = require('./config.json');
const autoR = require('./model/regex-model');

module.exports.discord = client;

require('dotenv').config();
require('./napthe-api');

client.commands = new Collection();
client.PREFIX = PREFIX;

// MONGO
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_STRING).then(() => {
    console.log("Connected to databases!");
});


readdirSync('./commands/').forEach(dir => {
    readdirSync('./commands/' + dir + "/").forEach(pull => {
        const cmd = require(`./commands/${dir}/${pull}`);
        if(cmd.name) {
            client.commands.set(cmd.name, cmd);
            console.log("LOAD " + cmd.name)
        } else console.log(pull + " -> Thiếu cmd.name");
    });
});

const tickets = require('./model/tickets-model');

client.on('ready', () => {
    console.log("Main ready!");

    client.user.setActivity("Market Land", {type: "WATCHING"});

    client.guilds.cache.forEach(async g => {
        let data = await tickets.findOne({ guildId: g.id });
        if(!data) return;
        if(!data.channelId || !data.messageId) return;

        let channel = g.channels.cache.get(data.channelId);

        channel?.messages.fetch(data.messageId).then(m => {
            require('./tickets/sync')(m);
        }).catch(console.error);

        setTimeout(() => {
            data.tickets?.forEach(async d => {
                let channel = client.channels.cache.get(d.channelId);
                if(!channel) return;
                
                channel?.messages.fetch(d.messageId).then(async m => {
                    let compo = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(d.channelId)
                                .setStyle('DANGER')
                                .setLabel('Huỷ phòng')
                        );

                    m.edit({components: [compo]});

                    const collector = m.createMessageComponentCollector({ componentType: 'BUTTON' });

                    collector.on('collect', async interaction => {
                        if(interaction.customId == d.channelId) {
                            await interaction.deferUpdate().catch(()=>{});
                            
                            if(WHITELIST_CMDS.indexOf(interaction.members.user.id) < 0) return;

                            await interaction.channel.send("Ticket sẽ xoá trong vài giây tới!");
                            
                            data.tickets.filter(data => d.channelId !== data.channelId);
                            data.save();
                            
                            await interaction.channel.delete().catch(console.error); 
                        }
                    })

                }).catch(console.error);
            });
        }, 5000);
    });
    
});

client.on('channelCreate', channel => {
    if(!DEV && channel.name.startsWith("ticket-")) {
        client.users.fetch(USER_ID).then(u => u.send(channel.toString() + " - New ticket!").catch(console.error)).catch(console.error);
    }
});

client.on('messageDelete', async message => {
    if(!message || !message.channel || !message.guild || !message.author || message.author.bot) return;
    
    if(message.channel.id == "860178208041074705" && message.content.startsWith("+1")) {
        let c = message.guild.channels.cache.get("885144922901082182");
        if(c.isVoice()) c.name.split(/ +/ig).forEach(async d => {
            if(!isNaN(d)) {
                await message.guild.channels.fetch("885144922901082182").then(c => c.setName(c.name.replace(d, +d - 1)));
            }
        });
    }
});

client.on('messageCreate', async message => {
    if(!message || !message.channel || !message.guild || !message.author) return;
    
    if(DEV) return;

    let textData = await autoR.findOne({ guildId: message.guildId });
    if(!message.author.bot && textData && textData.data) {
        if(message.author.id == USER_ID || WHITELIST_CMDS.indexOf(message.author.id) > -1) {
            let respond = textData.data.filter(d => message.content.startsWith(PREFIX) && d.content == message.content.slice(PREFIX.length).toLowerCase())
            
            if(respond.length > 0) {
                message.channel.send(respond[0].reply);
                if(message.deletable) message.delete();
            }
            
        }
    }

    if(!(message.author.id == "557628352828014614")) return;
    await message.guild.channels.fetch(message.channel.id).then(async channel => {
        if(!message.guild.channels.cache.get(message.channel.id).name.startsWith("ticket-")) return;
        
        let member = message.mentions.members.first();
        if(member) await channel.setName(channel.name + "-" + member?.user.username.toLowerCase());
    });
});

client.on('messageCreate', async message => {
    if(!message || !message.channel || !message.guild || !message.author || message.author.bot) return;
    
    if(!DEV && message.author.id !== USER_ID && (CHANNEL_NOTIFY.indexOf(message.channelId) > -1
    || message.channel.name.startsWith("ticket-"))) {
        client.users.fetch(USER_ID)?.then(u => u.send(message.channel.toString() + " | *" + message.author.tag + "* SAID: " + message.content + (message.attachments.first() ? message.attachments.map(m => m?.proxyURL) : "")).catch(console.error)).catch(()=>{});
        if(message.content) client.channels.cache.get("900422916171268146").send({
            embeds: [{
                description: message.channel.toString() + " (" + message.channel.name + ") | *" + message.author.tag + "*   : " + message.content + (message.attachments.first() ? message.attachments.map(m => m?.proxyURL) : ""),
                color: "GREEN"
            }]
        }).catch(console.error);
    }

    if(!DEV && message.channel.id == "860178208041074705" && message.content.startsWith("+1")) {
        let c = message.guild.channels.cache.get("885144922901082182");
        if(c.isVoice()) c.name.split(/ +/ig).forEach(async d => {
            if(!isNaN(d)) {
                await message.guild.channels.fetch("885144922901082182").then(c => c.setName(c.name.replace(d, +d + 1)));
            }
        });
    }

    // if(message.content.startsWith("#invites")) console.log("[" + new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh'}) + "] " + message.author.tag + " | " + message.content);

    if(!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commands.get(cmdName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if(!cmd) return;
    if(cmd.delete && message.deletable) message.delete();

    if(!cmd.default && message.author.id !== USER_ID && WHITELIST_CMDS.indexOf(message.author.id) < 0) return;

    cmd.execute(client, message, args);
});

client.login(process.env.TOKEN, console.error);