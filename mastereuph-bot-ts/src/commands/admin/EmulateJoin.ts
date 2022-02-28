import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, CommandInteractionOption, GuildMember } from 'discord.js';
import BaseCommand from '../../base/classes/BaseCommand';
import Client from '../../types/Client';

export default class EmulateJoinCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('emulate-join')
                .setDescription('emulates a join event for a choosen user')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('the user to emulate a join event for')
                ),
            'admin'
        );
    }

    async execute(client: Client, interaction: CommandInteraction<CacheType>, options: Readonly<CommandInteractionOption<CacheType>[]>): Promise<void> {
        if (!options[0]) {
            client.client.emit('guildMemberAdd', interaction.member as GuildMember);
            interaction.reply({ ephemeral: true, content: `Emulated Join Event for <@!${interaction.member.user.id}>` });
        } else {
            client.client.emit('guildMemberAdd', options[0].member as GuildMember);
            interaction.reply({ ephemeral: true, content: `Emulated Join Event for <@!${options[0].user.id}>` });
        }
    }
}