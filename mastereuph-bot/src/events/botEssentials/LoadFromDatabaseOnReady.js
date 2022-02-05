const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

const guildWelcomeChannels = new Map();
const guildStrings = new Map();

module.exports = class LoadFromDatabaseOnReadyEvent extends BaseEvent {
  constructor () {
    super('ready');
    this.connection = StateManager.connection;
  }
  async run (client) {
    console.log(client.user.tag + ' has logged in.');
    
    client.guilds.cache.forEach(guild => {
      this.connection.query(
        `SELECT welcomeChanneldId FROM GuildConfigurable WHERE guildId = '${guild.id}'`
      ).then(result => {
        const guildId = guild.id;
        const welcomeChanneldId = result[0][0].welcomeChanneldId;
        guildWelcomeChannels.set(guildId, welcomeChanneldId);
        StateManager.emit('welcomeChannelFetched', guildId, welcomeChanneldId);
      }).catch(err => console.log(err));
    });
    client.guilds.cache.forEach(guild => {
      this.connection.query(
        `SELECT welcomeString FROM GuildConfigurable WHERE guildId = '${guild.id}'`
      ).then(result => {
        const guildId = guild.id;
        const welcomeString = result[0][0].welcomeString;
        guildStrings.set(guildId, welcomeString);
        StateManager.emit('welcomeStringFetched', guildId, welcomeString);
      }).catch(err => console.log(err));
    });
  }
}