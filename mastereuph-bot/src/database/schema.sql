CREATE DATABASE mastereuphDB;
use mastereuphDB;
CREATE TABLE Guilds (
  guildId VARCHAR(100) NOT NULL PRIMARY KEY,
  guildOwnerId VARCHAR(100) NOT NULL
);
CREATE TABLE GuildConfigurable (
  guildId VARCHAR(100) NOT NULL PRIMARY KEY,
  welcomeChanneldId VARCHAR(100),
  welcomeString VARCHAR(500) DEFAULT "Hello"
);