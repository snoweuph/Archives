import { ApplicationCommand, Client, Collection, Intents } from "discord.js";
import { config } from "dotenv";
import { loadCommands } from "../utils/register";
config();
import BaseCommand from "../utils/structs/baseCommand";

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

const commands = new Collection<string, BaseCommand>();
const commandCategories = new Array<string>();

async function start() {
    await loadCommands(client, commands, commandCategories, "../bot/commands");
    await client.login(process.env.BOT_TOKEN);
    let _commands = client.application?.commands;
    let commandData = await _commands?.fetch();
    commandData?.forEach((registeredCommand: ApplicationCommand) => {
        commands?.delete(registeredCommand.id);
    });
    commands.forEach((cmd: BaseCommand) => {
        _commands?.create(cmd.data);
    });
    return console.log("Done Registering Commands");
}

start();
