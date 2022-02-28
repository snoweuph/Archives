import BaseCommand from "../../../utils/structs/baseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, MessageComponentInteraction, Options, EmbedFieldData } from "discord.js";
import { EmbedType, medium } from "../../../utils/embed";
import { APIMessage } from "discord-api-types";

export default class PingCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Replies with Pong!"),
            'default'
        );
    }
    async execute(client: Client, interaction: MessageComponentInteraction, options: Options): Promise<void> {
        var fields: Array<EmbedFieldData> = [
            {
                name: 'Websocket heartbeat',
                value: '`' + client.ws.ping + '`ms.',
            },
            {
                name: 'Roundtrip latency',
                value: '`calculating`',
            },
        ];
        let Embd = await medium(
            EmbedType.normal,
            'Pong!',
            fields,
            null,
            null,
            true
        )
        interaction.reply({ embeds: [Embd], fetchReply: true }).then((result: APIMessage) => {
            var res = result.embeds[0];
            res.fields[1].value =
                '`' + (+result.timestamp - interaction.createdTimestamp) + '`ms.';
            interaction.editReply({ embeds: [res] });
        });
    }
}