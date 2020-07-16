const config = require('./bot')

module.exports = [
    {
        name: 'general',
        required: {
            permissions: []
        }
    },
    {
        name: 'admin',
        required: {
            permissions: ['ADMINISTRATOR'],
        }
    },
    {
        name: 'dev',
        required: {
            permissions: [],
            id: config.owners
        }
    }
]