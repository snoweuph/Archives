const { Client, Collection, Intents } = require('discord.js');

const client = new Client({intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS
]});

const StateManager = require('../utils/StateManager');

const { loadCommands, loadButtonInteractions, registerEvents } = require('../utils/register');
client.commands = new Collection();
client.commandCategories = new Array();
client.buttonInteractions = new Collection();

(async () => {
    let tryes = 0;
    let maxTryes = 10;
    while(typeof(StateManager.connection) == 'undefined'){
        await new Promise(r => setTimeout(r, 500));
        tryes++;
        if(tryes >= maxTryes){
            break;
        }
    }

    console.log(StateManager.connection.config);

    await loadCommands(client, '../commands');
    console.log('Registerd Commands:')
    console.log(client.commands);

    await loadButtonInteractions(client, '../buttonInteractions');
    console.log('Registerd Button Interactions:');
    console.log(client.buttonInteractions);

    await registerEvents(client, '../events');
    console.log('Registerd Events:')
    console.log(client.eventNames());
    console.log('Test Completed');
    process.exit();
})();