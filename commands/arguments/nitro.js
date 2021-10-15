module.exports = {
    name: "nitro",
    aliases: ['ni'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
        <a:nitro:883188390642745374> **THÔNG TIN VỀ NITRO** <a:nitro:883188390642745374>

        <a:nitro:883188390642745374> NITRO THÁNG <a:nitro:883188390642745374>
        > <a:nitroboost:883188103987212288> Nitro Boost 170k VNĐ hoặc 8m5<a:owo:895874259132510269>/🥑**
        > <a:nitroclassic:883188139437461524> Nitro Classic 90k VNĐ hoặc 4m5<a:owo:895874259132510269>/🥑**

        <a:nitro:883188390642745374> NITRO NĂM <a:nitro:883188390642745374>
        > <a:nitroboost:883188103987212288> Nitro Boost: 1.500K VNĐ 
        > <a:nitroclassic:883188139437461524> Nitro Classic 750K VNĐ
        `);
    }
}