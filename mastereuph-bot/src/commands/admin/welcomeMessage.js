const BaseCommand = require('../../utils/structures/BaseCommand');
const StateManager = require('../../utils/StateManager')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Embd = require('../../utils/embd');
const Msg = require('../../assets/json/messages.json');
module.exports = class welcomeMessageCommand extends BaseCommand{
    constructor(){
        super(
            new SlashCommandBuilder()
                .setName('welcome-message')
                .setDescription('sets the Welcome Message.')
                .addStringOption(option => 
                    option
                        .setName('message')
                        .setRequired(true)
                        .setDescription('you can use {member} for the member that joined and {server} for the servername')
                ),
            'admin'
        );
    }
	async execute(client, interaction, options) {
        
        var newWelcomeString = options._hoistedOptions[0].value.replace(`'`,'').replace('`','')
        if(newWelcomeString.length > 500){
            const embed = Embd.short(Embd.type.warning, `**Welcome-Message**`, 'new message: `' + newWelcomeString + '` is to long! (max length is 500)')
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
        try {
            await StateManager.connection.query(
                `UPDATE GuildConfigurable SET welcomeString = '${newWelcomeString}' WHERE guildId = '${interaction.guild.id}'`
            )
            StateManager.emit('welcomeStringUpdated', interaction.guild.id, newWelcomeString);
            const embed = await Embd.short(Embd.type.normal, `**Welcome-Message**`, 'changed WelcomeString to: ```' + newWelcomeString + '```')
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err)
            const embed = await Embd.shor(Embd.type.error, `**Welcome-Message**`, Msg.errorOnExecution)
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
	}
};