const BaseCommand = require('../../utils/structures/BaseCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton} = require('discord.js');
module.exports = class joinCommand extends BaseCommand{
	constructor(){
		super(
			new SlashCommandBuilder()
				.setName('join')
				.setDescription('tests the join command')
                .addUserOption(option =>
                    option
                        .setName('member')
                        .setDescription('the member to emit the joinevent for')
                ),
			'admin'
		);
	}
	async execute(client, interaction, options) {
        if(!options._hoistedOptions[0]){
            client.emit('guildMemberAdd', interaction.member);
        }else{
            console.log(options._hoistedOptions[0]);
            client.emit('guildMemberAdd', options._hoistedOptions[0]);
        }
        interaction.reply('done');
	}
};