const config = require('../../config')
const locale = require('../locale').ko
const tools = require('./tools')
const knex = tools.database.knex

module.exports = async (client, msg) => {
    let prefix
    if (!msg.guild) prefix = config.bot.prefix
    if (config.bot.owners.includes(msg.author.id)) {
        if (msg.content.startsWith(config.bot.adminPrefix)) {
            prefix = config.bot.adminPrefix
        } else if (msg.guild) {
            let guildprf = JSON.parse((await knex(
                'guilds'
            ).where(
                'id',
                msg.guild.id
            )).config).prefix
            if (msg.content.startsWith(guildprf)) {
                prefix = guildprf
            } else {
                config.bot.adminPrefix
            }
        } else {
            prefix = config.bot.adminPrefix
        }
    }
    if (msg.author.bot || !msg.content.startsWith(prefix)) return
    const args = msg.content.slice(prefix.length).split(/ +/)
    const cmd = args.shift()
    msg.data = {
        argList: args, raw: msg.content, args: args.join(' '),
        prefix, cmd
    }
    const command = client.commands.get(cmd)
    if (!command) return
    if (typeof command.props.perm === 'string')
        command.props.perm = config.permissions.find(r => r.name === command.props.perm)
    if (command.props.guildOnly && !msg.guild) {
        return msg.reply(locale.error.guildOnly)
    }
    if ((await knex('users').where('id', msg.author.id)).length === 0) {
        await knex('users').insert({id: msg.author.id})
        console.log(`[INSERT] NEW USER: ${msg.author.tag}(${msg.author.id})`)
    }
    if (command.props.perm) {
        if (msg.guild && !msg.member.permissions.has(command.props.perm.required.permissions) && !config.bot.owners.includes(msg.author.id)) {
            return msg.reply(locale.error.noPermissions.bind({perm: command.props.perm.name}))
        }
        if (command.props.perm.required.id && !command.props.perm.required.id.includes(msg.author.id)) {
            return msg.reply(locale.error.noPermissions.bind({perm: command.props.perm.name}))
        }
    }
    await command.execute(client, msg, locale)
}