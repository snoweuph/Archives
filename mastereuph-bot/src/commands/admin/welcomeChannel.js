const BaseCommand = require('../../utils/structures/BaseCommand');
const StateManager = require('../../utils/StateManager')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Embd = require('../../utils/embd');
const Msg = require('../../assets/json/messages.json');
module.exports = class welcomeChannelCommand extends BaseCommand{
    constructor(){
        super(
            new SlashCommandBuilder()
                .setName('welcome-channel')
                .setDescription('sets the channel for the Welcome Message.')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .addChannelType(0)
                        .setDescription('The channel where  the welcome  message will be send.')
                        .setRequired(true)
                ),
            'admin'
        );
    }
	async execute(client, interaction, options) {
        try {
            await StateManager.connection.query(
                `UPDATE GuildConfigurable SET welcomeChanneldId = '${options._hoistedOptions[0].value}' WHERE guildId = '${interaction.guild.id}'`
            )
            StateManager.emit('welcomeChannelUpdated', interaction.guild.id, options._hoistedOptions[0].value);
            const embed = await Embd.short(Embd.type.normal, `**Welcome-Channel**`, 'changed WelcomeChannel to: <#' + options._hoistedOptions[0].value +'>')
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err)
            const embed = await Embd.shor(Embd.type.error, `**Welcome-Channel**`, Msg.errorOnExecution)
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
	}
};