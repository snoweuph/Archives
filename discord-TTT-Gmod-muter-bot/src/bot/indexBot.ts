import { Client, Collection, Intents } from 'discord.js';
import { loadCommands, loadButtonInteractions, loadEvents } from '../utils/register';
import BaseCommand from '../utils/structs/baseCommand';
import BaseButtonInteraction from '../utils/structs/baseButtonInteraction';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

const commands = new Collection<string, BaseCommand>();
const commandCategories = new Array<string>();
const buttonInteractions = new Collection<string, BaseButtonInteraction>();

async function start() {
    await loadCommands(client, commands, commandCategories, '../bot/commands');
    await loadButtonInteractions(client, buttonInteractions, '../bot/buttonInteractions');
    await loadEvents(client, '../bot/events');
    await client.login(process.env.BOT_TOKEN);
    console.log(`Logged in as ${client.user?.tag}`);
}

export default start;