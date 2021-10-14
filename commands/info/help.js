const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    
    
    async execute (client, message, args) {
        let cmd = [];

        readdirSync('./commands/').forEach(dir => {
            readdirSync('./commands/' + dir + "/").forEach(pull => {
                const cmds = require(`../../commands/${dir}/${pull}`);
                if(cmds.name) cmd.push(cmds.name);
            });
        });

        await message.reply({content: "Lệnh có sẵn: `" + cmd.join("`, `") + "`.", allowedMentions: { repliedUser: false }});
    }
}