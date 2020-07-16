const config = require('../../../../../../config')
const p = config.bot.prefix

module.exports = {
    name: '관리',
    aliases: ['moderator'],
    title: '도움말 - 관리',
    fields: [
        {
            name: '슬로우모드',
            value: `${p}슬로우모드 <시간(초)>`
        }
    ]
}