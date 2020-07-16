const customEmbed = require('../../bot/tools/interface/embed')

module.exports = {
    guildOnly: '이 명령어는 서버에서만 사용 가능합니다.',
    noPermissions: '이 명령어를 실행하기 위해 필요한 권한이 없습니다. ```fix\n필요한 권한: {perm}```',
    usage: (msg) => {
        const embed = customEmbed(msg)
        embed.addField('명령어', '```fix\n' + msg.data.prefix + msg.data.cmd + ' ' + msg.client.commands.get(msg.data.cmd).props.args.map(r => `[${argTypes[r.name]}]`).join(' ') + '\n```')
        embed.addField('변수 목록', '```ini\n' + msg.client.commands.get(msg.data.cmd).props.args.map(r => `[${argTypes[r.name]} - ${argTypes[r.type]}]`).join(' ') + '\n```')
        return embed
    }
}

const argTypes = {
    text: '텍스트',
    script: '스크립트',
    time: '시간',
    int: '수'
}
