const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('./structures/BaseCommand');
const BaseEvent = require('./structures/BaseEvent');
const BaseButtonInteraction = require('./structures/BaseButtonInteraction');

async function loadCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await loadCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Command = require(path.join(filePath, file));
      if(Command.prototype instanceof BaseCommand){
        const command = new Command();
        const category = command.category;
        if(!client.commandCategories.includes(category)){
          client.commandCategories.push(category);
        }
        client.commands.set(command.data.name, command);
      }
    }
  }
  return true;
}

async function loadButtonInteractions(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await loadButtonInteractions(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const ButtonInteraction = require(path.join(filePath, file));
      if (ButtonInteraction.prototype instanceof BaseButtonInteraction) {
        const buttonInteraction = new ButtonInteraction();
        client.buttonInteractions.set(buttonInteraction.uniqeID, buttonInteraction);
      }
    }
  }
  return true;
}

async function registerEvents(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())await registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
  return true;
}

module.exports = { loadCommands, loadButtonInteractions, registerEvents };