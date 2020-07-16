module.exports = (msg) => {
    const discord = require('discord.js')

    const embed = new discord.MessageEmbed()

    embed.setFooter(msg.author.tag, msg.author.avatarURL())
    embed.setTimestamp(new Date())
    embed.setColor('#00ffbf')

    return embed
}