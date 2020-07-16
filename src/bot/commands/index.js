function initialize(client) {
    require('./dev')(client.registerCommand)
    require('./economy')(client.registerCommand)
    require('./system')(client.registerCommand)
    require('./moderator')(client.registerCommand)
}

module.exports = initialize