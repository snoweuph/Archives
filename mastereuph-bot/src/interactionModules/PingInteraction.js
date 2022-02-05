const Embd = require('../utils/embd');

async function run(client, interaction) {
	var fields = [
		{
			name: 'Websocket heartbeat',
			value: '`' + client.ws.ping + '`ms.',
		},
		{
			name: 'Roundtrip latency',
			value: '`calculating`',
		},
	];
	var Embed = await Embd.medium(
		Embd.type.normal,
		'Pong!',
		fields,
		null,
		null,
		null,
		true
	);
	interaction.reply({ embeds: [Embed], fetchReply: true }).then((result) => {
		var res = result.embeds[0];
		res.fields[1].value =
			'`' + (result.createdTimestamp - interaction.createdTimestamp) + '`ms.';
		interaction.editReply({ embeds: [res] });
	});
}
module.exports = { run };
