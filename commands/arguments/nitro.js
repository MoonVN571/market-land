module.exports = {
    name: "nitro",
    aliases: ['pan'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
        <:spotifylogo:883188529570676747> **THÔNG TIN VỀ SPOTIFY** <:spotifylogo:883188529570676747> 

        > <a:tick:883188266403242015> **3 tháng: 75k - 4m <a:owo:895874259132510269>/🥑**
        > <a:tick:883188266403242015> **6 tháng: 120k - 7m <a:owo:895874259132510269>/🥑**
        > <a:tick:883188266403242015> **1 năm: 200k - 12m <a:owo:895874259132510269>/🥑**
        > <a:tick:883188266403242015> **Vĩnh viễn: 350k - 16m <a:owo:895874259132510269>/🥑**
        `);
    }
}