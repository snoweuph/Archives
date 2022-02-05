require('dotenv').config();
const { Client, Collection, Intents } = require('discord.js');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const client = new Client({intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS
]});

const StateManager = require('./utils/StateManager');
const { loadCommands, loadButtonInteractions, registerEvents } = require('./utils/register');
client.commands = new Collection();
client.commandCategories = new Array();
client.buttonInteractions = new Collection();

(async () => {
    while(typeof(StateManager.connection) == 'undefined'){
        await new Promise(r => setTimeout(r, 500));
    }
    await loadCommands(client, '../commands');
    await loadButtonInteractions(client, '../buttonInteractions');
    await registerEvents(client, '../events');
    await client.login(process.env.BOT_TOKEN);
})();