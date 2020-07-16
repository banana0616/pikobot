const knex = require('../../tools').database.knex

module.exports.execute = async (client, msg) => {
    let user = msg.author
    let money = (await knex('users').where('id', user.id))[0].money
    msg.channel.send(`${user.tag}님의 잔고: ${money}💰`)
}

module.exports.props = {
    name: '돈',
    aliases: [
        '잔고'
    ],
    perms: 'general',
    args: []
}