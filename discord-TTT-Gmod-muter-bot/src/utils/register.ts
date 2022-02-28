import { join } from 'path';
import { promises as fs } from 'fs';
import BaseCommand from './structs/baseCommand';
import BaseButtonInteraction from './structs/baseButtonInteraction';
import BaseEvent from './structs/baseEvent';
import { Client, Collection } from 'discord.js';

async function loadCommands(client: Client, commands: Collection<string, BaseCommand>, commandCategories: Array<string>, dir: string) {
    const filePath = join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(join(filePath, file));
        if (stat.isDirectory()) await loadCommands(client, commands, commandCategories, join(dir, file));
        if (!file.endsWith('.ts')) return;
        const Command = require(join(filePath, file));
        if (Command.prototype instanceof BaseCommand) {
            const command = new Command();
            const category = command.category;
            if (!commandCategories.includes(category)) {
                commandCategories.push(category);
            }
            commands.set(command.data.name, command);
        }
    }
}

async function loadButtonInteractions(client: Client, buttonInteractions: Collection<string, BaseButtonInteraction>, dir: string) {
    const filePath = join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(join(filePath, file));
        if (stat.isDirectory()) await loadButtonInteractions(client, buttonInteractions, join(dir, file));
        if (!file.endsWith('.ts')) return;
        const ButtonInteraction = require(join(filePath, file));
        if (ButtonInteraction.prototype instanceof BaseButtonInteraction) {
            const buttonInteraction = new ButtonInteraction();
            buttonInteractions.set(buttonInteraction.uniqueID, buttonInteraction);
        }
    }
}

async function loadEvents(client: Client, dir: string) {
    const filePath = join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(join(filePath, file));
        if (stat.isDirectory()) await loadEvents(client, join(dir, file));
        if (!file.endsWith('.ts')) return;
        const Event = require(join(filePath, file));
        if (Event.prototype instanceof BaseEvent) {
            const event: BaseEvent = new Event();
            client.on(event.event, event.execute.bind(event, client));
        }
    }
}

export { loadCommands, loadButtonInteractions, loadEvents };