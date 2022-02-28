import Client from '../../types/Client';
import BaseEvent from '../../base/classes/BaseEvent';
import StateManager from '../../base/StateManager';
import { Connection } from 'mysql2/promise';

export default class LoadGuildsEvent extends BaseEvent {
    connection: Connection;
    constructor() {
        super('ready');
        this.connection = StateManager.connection;
    }

    async execute(client: Client, ...args: any[]): Promise<void> {
        //welcomeMessageEnabled
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageEnabled FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageEnabledFetched', guild.id, null);
                const welcomeMessageEnabled = result[0][0].welcomeMessageEnabled;
                StateManager.emit('welcomeMessageEnabledFetched', guild.id, welcomeMessageEnabled);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageChannelId
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageChannelId FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageChannelIdFetched', guild.id, null);
                const welcomeMessageChannelId = result[0][0].welcomeMessageChannelId;
                StateManager.emit('welcomeMessageChannelIdFetched', guild.id, welcomeMessageChannelId);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageTitle
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageTitle FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageTitleFetched', guild.id, null);
                const welcomeMessageTitle = result[0][0].welcomeMessageTitle;
                StateManager.emit('welcomeMessageTitleFetched', guild.id, welcomeMessageTitle);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageContent
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageContent FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageContentFetched', guild.id, null);
                const welcomeMessageContent = result[0][0].welcomeMessageContent;
                StateManager.emit('welcomeMessageContentFetched', guild.id, welcomeMessageContent);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageEmbedColor
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageEmbedColor FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageEmbedColorFetched', guild.id, null);
                const welcomeMessageEmbedColor = result[0][0].welcomeMessageEmbedColor;
                StateManager.emit('welcomeMessageEmbedColorFetched', guild.id, welcomeMessageEmbedColor);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageImageEnabled
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageImageEnabled FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageImageEnabledFetched', guild.id, null);
                const welcomeMessageImageEnabled = result[0][0].welcomeMessageImageEnabled;
                StateManager.emit('welcomeMessageImageEnabledFetched', guild.id, welcomeMessageImageEnabled);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageImageURL
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageImageURL FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageImageURLFetched', guild.id, null);
                const welcomeMessageImageURL = result[0][0].welcomeMessageImageURL;
                StateManager.emit('welcomeMessageImageURLFetched', guild.id, welcomeMessageImageURL);
            }).catch(error => { console.log(error) });
        });
        //welcomeMessageImageAccentColor
        client.client.guilds.cache.forEach(guild => {
            this.connection.query(
                `SELECT welcomeMessageImageAccentColor FROM GuildSettings WHERE guildId = '${guild.id}'`
            ).then(result => {
                if (!result[0][0]) return StateManager.emit('welcomeMessageImageAccentColorFetched', guild.id, null);
                const welcomeMessageImageAccentColor = result[0][0].welcomeMessageImageAccentColor;
                StateManager.emit('welcomeMessageImageAccentColorFetched', guild.id, welcomeMessageImageAccentColor);
            }).catch(error => { console.log(error) });
        });
    }
}