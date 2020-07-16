const createEmbed = require('../../tools').interface.embed

module.exports.execute = async (client, msg, locale) => {
    if (!msg.data.args || isNaN(Number(msg.data.args))) {
        return msg.reply(locale.error.usage(msg))
    }
    if (!msg.channel.permissionsFor(msg.guild.me).has('MANAGE_CHANNELS')) {
        return msg.reply('봇에 채널 관리 권한이 없습니다.')
    }
    try {
        await msg.channel.setRateLimitPerUser(Number(msg.data.args))
        const embed = createEmbed(msg)
        embed.setTitle('슬로우모드')
        embed.setDescription(`<a:yes:731437745582637066> 슬로우모드가 \`${msg.data.args}\`초로 설정되었습니다.`)
        msg.channel.send(embed)
    } catch (e) {
        const embed = createEmbed(msg)
        embed.setTitle('슬로우모드')
        embed.setDescription(`<a:false:732093517731725313> 슬로우모드 설정 중 오류가 발생했습니다. \`\`\`js\n${e.stack}\`\`\``)
        msg.channel.send(embed)
    }
}

module.exports.props = {
    name: '슬로우모드',
    aliases: ['slowmode'],
    perm: 'admin',
    guildOnly: true,
    args: [
        {
            name: 'time',
            type: 'int'
        }
    ]
}