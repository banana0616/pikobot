const createEmbed = require('../../../tools/interface/embed')
const components = require('./helps')

module.exports.execute = (client, msg) => {
    const embed = createEmbed(msg)
    if (!msg.data.args || !components.find(r => r.name === msg.data.args || r.aliases.includes(msg.data.args))) {
        embed.setTitle('피코봇 도움말')
    } else {
        let data = components.find(r => r.name === msg.data.args || r.aliases.includes(msg.data.args))
        embed.setTitle(data.title)
        embed.addFields(data.fields)
    }
    msg.reply(embed)
}

module.exports.props = {
    name: '도움말',
    aliases: ['도움', 'help'],
    perm: 'general'
}