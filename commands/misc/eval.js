module.exports = {
    name: "eval",
    aliases: ['e'],
    delete: false,
    
    async execute (client, message, args) {
        try {
            let e = await eval(args.join(" ").split("\n").join(" "));
            
            message.reply({content:"``" + e + "``", allowedMentions: { repliedUser: false }})
        } catch(e) {
            message.reply({content:"```Error: " + e.message + "```", allowedMentions: { repliedUser: false }})
        }
    }
}