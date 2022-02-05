const BaseCommand = require('../../utils/structures/BaseCommand');
const { SlashCommandBuilder} = require('@discordjs/builders');
const fetch = require("node-fetch");
const Embd = require('../../utils/embd');

module.exports = class activityCommand extends BaseCommand {
	constructor() {
		super(
			new SlashCommandBuilder()
				.setName('activity')
				.setDescription('Start a new session for an activity.')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .addChannelType(2)
                        .setDescription('The channel to start the activity in.')
                        .setRequired(true)

                )
				.addStringOption((option) =>
					option
						.setName('id')
						.setRequired(true)
						.setDescription(
							'The ID of the activity you want to start.'
						)
						.addChoices([
							['YoutubeTogether', '880218394199220334'],
							['PokerNight', '755827207812677713'],
						])
				),
			'fun'
		);
	}
	async execute(client, interaction, options) {
        const res  = await fetch(`https://discord.com/api/v8/channels/${options._hoistedOptions[0].value}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: options._hoistedOptions[1].value,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${process.env.BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        })
        const invite = await res.json();
        if(!invite.code){
            const embed = await Embd.short(Embd.type.warning, '**Activity**', 'There was an error trying to start the activity.')
            return interaction.reply({ embeds: [embed] });
        }
        const fields =  [
            {
                name: `**${invite.target_application.name}**`,
                value: `[Join ${invite.target_application.name}](https://discord.com/invite/${invite.code})`,
            }
        ]
        const embed = await Embd.medium(Embd.type.normal, '**Activity**', fields)
        return interaction.reply({ embeds: [embed] });
	}
};
