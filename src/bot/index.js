const PikoClient = require('./bot')
const discord = require('discord.js')
const config = require('../../config')
const { MyBot } = require("koreanbots")
const tools = require('./tools')
const knex = tools.database.knex


const koreanBotsClient = new MyBot(config.bot.koreanBots.token)
const client = new PikoClient({presence: {activity: {name: `${config.bot.prefix}도움말`, type: 'LISTENING'}}, shardsCount: config.bot.options.shardCount})
client.webhook = new discord.WebhookClient('730752458166370354', 'ESennjuSRFUpHCnlthFHq23Hvu39VjnNTmCWwMFF-lwgtc2BS9Aovddq6jIOhQnP4cCH')

client.on('message', msg => require('./handler')(client, msg))

require('./commands')(client)


let update = count => koreanBotsClient.update(count)
    .then(res => console.log("서버 수를 정상적으로 업데이트하였습니다!\n반환된 정보:" + JSON.stringify(res)))
    .catch(function() {})


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.guilds.cache.forEach(async guild => {
        const result = await knex('guilds').where('id', guild.id)
        if (result.length === 0) {
            console.log(`[INSERT] NEW GUILD: ${guild.name}(${guild.id})`)
            await guild.client.webhook.send(`**NEW GUILD**\nID: ${guild.id} NAME: ${guild.name} \nOWNER: ${guild.owner.user.tag}\nTOTAL: ${client.guilds.cache.size}\n=================================`)
            await knex('guilds').insert({id: guild.id})
        }
    })
    update(client.guilds.cache.size)
    setInterval(() => update(client.guilds.cache.size), config.bot.koreanBots.interval)
})

client.on('guildCreate', async guild => {
    const result = await knex('guilds').where('id', guild.id)
    if (result.length === 0) {
        console.log(`[INSERT] NEW GUILD: ${guild.name}(${guild.id})`)
        await guild.client.webhook.send(`**NEW GUILD**\nID: ${guild.id} NAME: ${guild.name}\n OWNER: ${guild.owner.user.tag}\nTOTAL: ${client.guilds.cache.size}\n=================================`)
        await knex('guilds').insert({id: guild.id})
    }
})

client.on('guildDelete', async guild => {
    await guild.client.webhook.send(`**LEFT GUILD**\nID: ${guild.id} NAME: ${guild.name} \nOWNER: ${guild.owner.user.tag}\nTOTAL: ${client.guilds.cache.size}\n=================================`)
})

client.login(config.bot.token)


String.prototype.bind = function(parameters, lang) {
    if (!lang) lang = 'ko'
    let text = this
    const glob = text.match(/%(.*?)%/g)
    if (glob) {
        glob.forEach(key => {
            const keyname = key.replace(/%/, '').replace(/%/, '')
            text = text.replace(key, String(locale[lang].global[keyname]) || '')
        })
    }
    const keys = text.match(/\{(.*?)\}/g)
    if (!keys) return this

    keys.forEach(key => {
        const keyname = key.replace(/\{/, '').replace(/\}/, '')
        text = text.replace(key, String(parameters[keyname]) || '')
    })

    return text
}
