const BaseCommand = require('../../utils/structures/BaseCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = class clearCommand extends BaseCommand{
    constructor(){
        super(
            new SlashCommandBuilder()
                .setName('clear')
                .setDescription('Clears specified amount of Messages')
                .addIntegerOption(option => option
                    .setName('amount')
                    .setRequired(true)
                    .setDescription('The Amount of Messages to clear')
                ),
            'admin'
        );
    }
	async execute(client, interaction, options) {
        const amount = options._hoistedOptions[0].value;
        switch(true){
            case amount > 1500:
                interaction.reply({ content: "Your amount is bigger than 1500", ephemeral: true});
                break;
            case amount <= 0:
                interaction.reply({ content: "Your amount is smaller than 1", ephemeral: true});
                break;
            default:
                await interaction.deferReply({ ephemeral: true});
                const cyclAmount = Math.floor(amount/100);
                const lastCyclcAmount = amount - cyclAmount * 100;
                var cleared = 0;

                cleared = await this.doDeleteCycle(interaction, cyclAmount, cleared, this);
                
                if(lastCyclcAmount != 0){
                    await interaction.channel.bulkDelete(lastCyclcAmount, true)
                    .then(messages => {
                        cleared += messages.size;
                    })
                }
                interaction.editReply({ content: `clearing completed, cleared ${cleared} message.`, ephemeral: true})
        }
	}
    doDeleteCycle(interaction, cyclAmmount, cleared, _class){
        return new Promise((resolve) => {
            interaction.channel.bulkDelete(100, true)
            .then(async function(messages){
                cleared += messages.size;
                if(messages.size == 0 || cyclAmmount-1 <= 0){
                    resolve(cleared);
                }else{
                    await _class.doDeleteCycle(interaction, cyclAmmount-1, cleared, _class)
                    .then(result => {
                        resolve(result);
                    });
                }
            });
        });
    }
};