CREATE TABLE users (
  steamId VARCHAR(255) NOT NULL PRIMARY KEY,
  discordId VARCHAR(255) NOT NULL,
);
CREATE TABLE serverSettingsTable(
  guildId VARCHAR(255) NOT NULL PRIMARY KEY,
  serverKey VARCHAR(1024) NOT NULL,
  channelId VARCHAR(255),
  pnNonConnectedPlayers BOOLEAN NOT NULL DEFAULT FALSE,
  muteNonConnectedPayers BOOLEAN NOT NULL DEFAULT FALSE,
  statusChannelId VARCHAR(255),
  logChannelId VARCHAR(255),
);