const BaseCommand = require('../../utils/structures/BaseCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const PingInteraction = require('../../interactionModules/PingInteraction');

module.exports = class pingCommand extends BaseCommand {
	constructor() {
		super(
			new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Replies with Pong!'),
			'default'
		);
	}
	async execute(client, interaction, options) {
		await PingInteraction.run(client, interaction);
	}
};
