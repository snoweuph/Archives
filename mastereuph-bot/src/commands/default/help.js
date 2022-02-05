const BaseCommand = require('../../utils/structures/BaseCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Embd = require('../../utils/embd');

module.exports = class helpCommand extends BaseCommand {
	constructor() {
		super(
			new SlashCommandBuilder()
				.setName('help')
				.setDescription('Gives you a list of all commands in their functions.')
				.addStringOption((option) =>
					option
						.setName('category')
						.setRequired(true)
						.setDescription(
							'The category for which the commands should be displayed.'
						)
						.addChoices([
							['Admin', 'admin'],
							['Default', 'default'],
							['Test', 'test'],
							['Fun', 'fun'],
						])
				),
			'default'
		);
	}
	async execute(client, interaction, options) {
		const category = options._hoistedOptions[0].value;
		if (!client.commandCategories.includes(category)) {
			interaction.reply({
				content: 'This Category does not exist',
				ephermal: true,
			});
			return;
		}
		let validCommandArray = [];
		for (const command of client.commands) {
			if (command[1].category == category) {
				validCommandArray.push(command);
			}
		}
		if (validCommandArray.length <= 0) {
			interaction.reply({
				content: 'There are no Commands for this Category.',
				ephermal: true,
			});
		}
		let fields = [];
		for (const command of validCommandArray) {
			fields.push({
				name: `__**${command[1].data.name}**__`,
				value: `${command[1].data.description}`,
			});
		}
		const TitleCategory = category.charAt(0).toUpperCase() + category.slice(1);
		const embed = await Embd.medium(
			Embd.type.normal,
			`Help *-> ${TitleCategory}*`,
			fields,
			client.user.avatarURL()
		);
		interaction.reply({ embeds: [embed] });
	}
};
