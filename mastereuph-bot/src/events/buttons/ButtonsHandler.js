const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');
const Msg = require('../../assets/json/messages.json');

module.exports = class ButtonsHandlerEvent extends BaseEvent {
  constructor () {
    super('interactionCreate');
    this.connection = StateManager.connection;
  }
  async run (client, interaction) {
    if (!interaction.isButton()) return;
    const buttonInteraction = client.buttonInteractions.get(interaction.customId);
    if(!buttonInteraction) return;
    try {
        await buttonInteraction.run(client, interaction);
    } catch (error) {
        console.log(error);
        return interaction.reply({ content: Msg.errorOnExecution});
    }
  }
}