require('dotenv').config();
const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

module.exports = class RegisterSlashCommandsEvent extends BaseEvent {
  constructor () {
    super('ready');
    this.connection = StateManager.connection;
  }
  async run (client) {
    const guild = client.guilds.cache.get(process.env.DEV_ID);
    let commands;
    if(process.env.REGISTER_ON_STARTUP != 'true'){
      return;
    }
    if(guild) {
      commands = guild.commands;
    }else{
      commands = client.application?.commands
    }
    var commandData = await commands?.fetch()
    commandData?.forEach(registeredCommand => {
      if(!client.commands.has(registeredCommand.name)){
        commands?.delete(registeredCommand)
      }
    })
    client.commands.forEach(cmd => {
      commands?.create(cmd.data);
    });
  }
}