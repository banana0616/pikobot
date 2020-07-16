const discord = require('discord.js')

class PikoClient extends discord.Client {
    commands = new discord.Collection()

    registerCommand = (command) => {
        this.commands.set(command.props.name, command)
        console.log(`Registered command ${command.props.name}`)
        command.props.aliases.forEach(alias => {
            this.commands.set(alias, command)
            console.log(`Loaded alias ${alias} from command ${command.props.name}`)
        })
    }

}

module.exports = PikoClient