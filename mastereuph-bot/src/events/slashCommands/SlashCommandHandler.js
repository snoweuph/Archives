const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');
const Msg = require('../../assets/json/messages.json');

module.exports = class SlashCommandHandlerEvent extends BaseEvent {
  constructor () {
    super('interactionCreate');
    this.connection = StateManager.connection;
  }
  async run (client, interaction) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    if (command.category == "admin" && !interaction.member.permissions.has('ADMINISTRATOR'))return;
    try {
      const { options } = interaction
      await command.execute(client, interaction, options);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: Msg.errorOnExecution});
    }
  }
}