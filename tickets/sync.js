const { Message, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const client = require('../index').discord;
const tickets = require('../model/tickets-model');
/**
 * @param {Message} message 
 */
module.exports = async (message) => {
    let compo = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(message.channel.id + '.1')
            .setStyle('SECONDARY')
            .setLabel('Mua hàng')
            .setEmoji('🛒'),
        new MessageButton()
            .setCustomId(message.channel.id + '.2')
            .setStyle('SECONDARY')
            .setLabel('Hỗ trợ')
            .setEmoji('📩')
    );

    message.edit({ components: [compo]});

    const collector = message.createMessageComponentCollector({  componentType: 'BUTTON' });

    collector.on('collect', async interaction => {
        if(interaction.customId == message.channel.id + '.1') {
            await interaction.reply({content: "Đang tiến hành tạo ticket...", ephemeral: true });
            createTickets(interaction, 'order');
        }

        if(interaction.customId == message.channel.id + '.2') {

            await interaction.reply({content: "Đang tiến hành tạo ticket...", ephemeral: true });

            createTickets(interaction, 'support');

        }
    });
}

/**
 * 
 * @param {Interaction} interaction 
 * @param {String} type 
 */
async function createTickets(interaction, type) {
    let data = await tickets.findOne({ guildId: interaction.guildId });

    let shopCategory = "908919410910187571";
    let supportCategory = "908919450693140480";

    let hasTicket = false;
    let channelId = '';
    await data?.tickets.forEach(d => {
        if(type == "support" && d.userId == interaction.user.id) hasTicket = true;
        channelId = d.channelId;
    });

    let category = '';
    if(type == 'support') category = supportCategory;
    if(type == 'order') category = shopCategory;

    let permissions = [
        { // deny everyone
            id: interaction.guild.roles.everyone?.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        },
        { // allow ticket author
            id: interaction.user.id,
            allow: ['VIEW_CHANNEL'] // 'SEND_MESSAGES'
        }
    ];


    if(type=='order'&&hasTicket) return await interaction.editReply({content: "Bạn chỉ được phép tạo 1 ticket hỗ trợ! Phòng của bạn: <#" + channelId + ">", ephemeral: true });

    interaction.guild.channels.create(interaction.user.tag, {
       parent: category,
       type: "GUILD_TEXT",
       permissionOverwrites: permissions
    }).then(async channel => {
        let compo = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(channel.id)
                    .setStyle('DANGER')
                    .setLabel('Đóng phòng')
            );
    
        let sentContent = {
            embeds: [{
                title: "Phòng Hỗ Trợ",
                description: "Phòng hỗ trợ bảo mật của bạn.\nCác nhân viên sẽ hỗ trợ bạn sớm nhất!",
                timestamp: new Date(),
                color: "GREEN"
            }],
            components: [compo]
        };

        await interaction.editReply({content: "Đã tạo ticket tại: " + channel.toString(), ephemeral: true });

        channel.send(sentContent).then(async m => {
            data.tickets.push({
                type: type,
                userId: interaction.user.id,
                channelId: m.channel.id,
                messageId: m.id
            });
            await data.save();
            
            const collector = m.createMessageComponentCollector({componentType: "BUTTON"});

            collector.on('collect', async interaction => {
                await interaction.deferUpdate().catch(()=>{});
                await interaction.channel.send("Ticket sẽ xoá trong vài giây tới!");

                setTimeout(async() => await interaction.channel.delete().catch(console.error), 3000);
            });

            if(type !== 'order') return;

            let orders = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setPlaceholder("Lựa chọn mặt hàng bạn cần mua:")
                    .setCustomId(m.channel.id)
                    .addOptions({
                        label: "Nitro / Server Boost",
                        value: '1',
                        emoji: '<:booster:898396409605271562>'
                    }, {
                        label: "Netflix",
                        value: '2',
                        emoji: '<:netflixlogo:898927490276425790>'
                    },{
                        label: "Spotify",
                        value: '3',
                        emoji: '<:spotifylogo:883188529570676747>'
                    }, {
                        label: "VPS",
                        value: '4',
                        emoji: '<:computer~2:897683038052425740>'
                    }, {
                        label: "Roblox",
                        value: '5',
                        emoji: '<:Roblox_logo:883188623955071036>'
                    }, {
                        label: "Tickets",
                        value: '6',
                        emoji: '<:ticket:879992704237445130>'
                    }, {
                        label: "Khác",
                        description: "Các sản phẩm không thuộc mục trên",
                        value: '7',
                        emoji: '🛒'
                    })
                    .setMaxValues(1)
                    .setMaxValues(1)
            )

            await channel.send({embeds:[{
                title: "MARKET LAND",
                description: "Chọn các mặt hàng bạn muốn mua, **Helper/Seller** sẽ liên hệ và trả lời ở đây.",
                color: "BLUE"
            }], components: [orders] })
            .then(async msg => {
                const filter = (i) => i.isSelectMenu();
                let collector = msg.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU' });
                
                collector.on('collect', async interaction => {
                    let seller = '887016449414139936';
                    if(interaction.values[0] == '5') seller = '903533108958220318'; // roblox
                    if(interaction.values[0] == '6') seller = '903533287639748609'; // vps
                    

                    await interaction.deferUpdate();

                    if(msg.deletable) msg.delete();

                    permissions.push({ // allow ticket seller
                        id: seller,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    });

                    permissions.push({ // allow ticket author
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    });

                    setTimeout(() => {
                        channel.permissionOverwrites.set(permissions);

                        msg.channel.send(`<@${seller}>`).then(m => {
                            // if(m.deletable) m.delete();
                        })
                    }, 1000);
                });
            });

        });
    });
}