use discordDB;
CREATE TABLE GuildSettings (
  guildId VARCHAR(64) NOT NULL PRIMARY KEY,
  welcomeMessageEnabled BOOLEAN NOT NULL DEFAULT FALSE,
  welcomeMessageChannelId VARCHAR(64),
  welcomeMessageTitle VARCHAR(128) NOT NULL DEFAULT 'Welcome',
  welcomeMessageContent VARCHAR(2048) NOT NULL DEFAULT 'Hello {member}!',
  welcomeMessageEmbedColor VARCHAR(7) NOT NULL DEFAULT '#0099ff',
  welcomeMessageImageEnabled BOOLEAN NOT NULL DEFAULT TRUE,
  welcomeMessageImageURL VARCHAR(512),
  welcomeMessageImageAccentColor VARCHAR(7) NOT NULL DEFAULT 'rainbow'
);