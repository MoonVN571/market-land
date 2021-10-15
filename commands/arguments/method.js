module.exports = {
    name: "method",
    aliases: ['me'],
    delete: true,
    
    async execute (client, message, args) {
        return message.channel.send(`
        <:iuni:893342986459574343> CÁCH NHẬN NITRO <:iuni:893342986459574343>
        <a:tick:883188266403242015>Loại 1: ADD CARD<a:tick:883188266403242015>
        <a:muiten:898396608083939369> Full bảo hành
        <a:muiten:898396608083939369> Không revoke
        <a:muiten:898396608083939369> Hỗ trợ về đêm

        <a:tick:883188266403242015>Loại 2: Link gift<a:tick:883188266403242015>
        <a:muiten:898396608083939369> Không bảo hành
        <a:muiten:898396608083939369> Có thể nhanh hoặc chậm
        <a:muiten:898396608083939369> Thao tác dễ

        `);
    }
}