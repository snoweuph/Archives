import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types';
import { CommandInteraction, CacheType, CommandInteractionOption } from 'discord.js';
import BaseCommand from '../../base/classes/BaseCommand';
import Client from '../../types/Client';
import StateManager from '../../base/StateManager';
import { Connection } from 'mysql2/promise';

export default class WelcomeMessageCommand extends BaseCommand {
    connection: Connection;
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('welcome-message')
                .setDescription('used to configure the welcome message')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('enabled')
                        .setDescription('used to enable or disable the welcome message')
                        .addBooleanOption((option) =>
                            option
                                .setName('enabled')
                                .setDescription('true for on, false for off')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('channel')
                        .setDescription('sets the channel for the welcome message')
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription('the channel where the welome message will be sent')
                                .setRequired(true)
                                .addChannelType(ChannelType.GuildText)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('title')
                        .setDescription('sets the title for the welcome message')
                        .addStringOption((option) =>
                            option
                                .setName('title')
                                .setDescription('you can use {user}, {server}, {tag} and {count} as placeholders')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('content')
                        .setDescription('sets the content for the welcome message')
                        .addStringOption((option) =>
                            option
                                .setName('content')
                                .setDescription('you can use {user}, {server}, {tag} and {count} as placeholders')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('embed-color')
                        .setDescription('sets the embed color for the welcome message')
                        .addStringOption((option) =>
                            option
                                .setName('embed-color')
                                .setDescription('should be in hex format #000000')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('image-enabled')
                        .setDescription('used to enable or disable the image for the welcome message')
                        .addBooleanOption((option) =>
                            option
                                .setName('enabled')
                                .setDescription('true for on, false for off')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('image-url')
                        .setDescription('sets the image for the welcome message')
                        .addStringOption((option) =>
                            option
                                .setName('image-url')
                                .setDescription('the image should have a size of 1024x380. to use the default image set this parameter to \'default\'')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('image-accent-color')
                        .setDescription('sets the accent color for the image for the welcome message')
                        .addStringOption((option) =>
                            option
                                .setName('image-accent-color')
                                .setDescription('should be in hex format #000000, use \'rainbow\' for a rainbow gradient')
                                .setRequired(true)
                        )
                ),
            'admin',
            5000
        );
        this.connection = StateManager.connection;
    }

    async execute(client: Client, interaction: CommandInteraction<CacheType>, options: Readonly<CommandInteractionOption<CacheType>[]>): Promise<void> {
        var newValue: string | boolean;
        let querry: string;
        switch (options[0].name) {
            case 'enabled':
                newValue = options[0].options[0].value as boolean;
                querry = `UPDATE GuildSettings SET welcomeMessageEnabled = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageEnabledFetched', interaction.guildId, newValue);
                break;
            case 'channel':
                newValue = options[0].options[0].value as string;
                querry = `UPDATE GuildSettings SET welcomeMessageChannelId = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageChannelIdFetched', interaction.guildId, newValue);
                break;
            case 'title':
                newValue = options[0].options[0].value as string;
                if (newValue.length > 128) {
                    newValue = newValue.substring(0, 128);
                }
                querry = `UPDATE GuildSettings SET welcomeMessageTitle = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageTitleFetched', interaction.guildId, newValue);
                break;
            case 'content':
                newValue = options[0].options[0].value as string;
                if (newValue.length > 2048) {
                    newValue = newValue.substring(0, 2048);
                }
                querry = `UPDATE GuildSettings SET welcomeMessageContent = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageContentFetched', interaction.guildId, newValue);
                break;
            case 'embed-color':
                newValue = options[0].options[0].value as string;
                if (newValue.length !== 7 || newValue.charAt(0) !== '#') {
                    return interaction.reply({ ephemeral: true, content: 'The embed color should be in hex format #000000' });
                }
                querry = `UPDATE GuildSettings SET welcomeMessageEmbedColor = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageEmbedColorFetched', interaction.guildId, newValue);
                break;
            case 'image-enabled':
                newValue = options[0].options[0].value as boolean;
                querry = `UPDATE GuildSettings SET welcomeMessageImageEnabled = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageImageEnabledFetched', interaction.guildId, newValue);
                break;
            case 'image-url':
                newValue = options[0].options[0].value as string;
                if (newValue == 'default') {
                    newValue = null;
                } else if (!(newValue.startsWith('https://') || newValue.startsWith('http://'))) {
                    return interaction.reply({ ephemeral: true, content: 'The image url should start with https:// or http://' });
                } else if (newValue.length > 512) {
                    return interaction.reply({ ephemeral: true, content: 'The image url should be shorter than 512 characters' });
                }
                querry = `UPDATE GuildSettings SET welcomeMessageImageUrl = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageImageUrlFetched', interaction.guildId, newValue);
                break;
            case 'image-accent-color':
                newValue = options[0].options[0].value as string;
                if ((newValue.length !== 7 || newValue.charAt(0) !== '#') && newValue !== 'rainbow') {
                    return interaction.reply({ ephemeral: true, content: 'The image accent color should be in hex format #000000' });
                }
                querry = `UPDATE GuildSettings SET welcomeMessageImageAccentColor = ? WHERE guildId = ${interaction.guildId}`;
                await this.connection.query(querry, [newValue]);
                StateManager.emit('welcomeMessageImageAccentColorFetched', interaction.guildId, newValue);
                break;
        }
        interaction.reply({ ephemeral: true, content: 'Succesfully updated' });
    }
}