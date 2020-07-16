const tools = require('../../tools')

module.exports.execute = async (client, msg, locale) => {
    if (msg.data.args === '') {
        return msg.reply(locale.error.usage(msg, module.exports.props.name))
    }
    if (msg.data.args.includes('client.token') && msg.data.args.includes('msg')) {
        return msg.reply('관리자라도 토큰은 안줌')
    }
    const embed = tools.interface.embed(msg)
    const input = msg.data.args.replace(/```js|```/gi, '')
    msg.reply('Evaluating...').then(async m => {
        const result = new Promise(resolve => resolve(eval(input)))

        return result
            .then(async output => {
                if (typeof output !== 'string')
                    output = require('util').inspect(output, {
                        depth: 0
                    })
                if (output.includes(client.token))
                    output = output.replace(client.token, '(봇 토큰)')
                if (output.length > 1010) {
                    console.log(output)
                    output = output.slice(0, 1010) + '\n...'
                }

                embed.setTitle('EVAL!!')
                embed.setDescription('<a:yes:731437745582637066>EVAL 성공\n입력\n' + '```js\n' + input + '```\n' + '출력\n' + '```js\n' + output + '```')
                embed.setColor('GREEN')
                await m.edit(embed)
                await m.react('🗑')
                const filter = (reaction, user) => {
                    return user.id === msg.author.id && reaction.emoji.name === '🗑'
                }
                try {
                    let del = await m.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                    let reaction = del.first()
                    if (reaction.emoji.name === '🗑') {
                        await m.delete()
                    }
                } catch (e) {
                    await m.reactions.cache.find(r => r.emoji.name === '🗑').remove()
                }
            })
            .catch(async error => {
                console.error(error)
                error = error.toString()

                if (error.includes(client.token))
                    error = error.replace(client.token, '(봇 토큰)')
                embed.setTitle('EVAL')
                embed.setDescription('<a:false:732093517731725313> EVAL 실패')
                embed.addField('📥입력', '```js\n' + input + '```')
                embed.addField('📤출력', 'err')
                embed.addField('오류', '```js\n' + error + '```')
                embed.setColor('RED')
                await m.edit(embed)
                await m.react('🗑')
                const filter = (reaction, user) => {
                    return user.id === msg.author.id && reaction.emoji.name === '🗑'
                }
                try {
                    let del = await m.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                    let reaction = del.first()
                    if (reaction.emoji.name === '🗑') {
                        await m.delete()
                    }
                } catch (e) {
                    await m.reactions.cache.find(r => r.emoji.name === '🗑').remove()
                }
            })
    })
}

module.exports.props = {
    name: '스크립트',
    aliases: [
        'eval',
        'script'
    ],
    perms: 'dev',
    args: [
        {
            name: 'script',
            type: 'text'
        }
    ]
}