const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');
const {MessageAttachment} = require('discord.js');
const Canvas = require('canvas');
const path = require('path');
const Embd = require('../../utils/embd');

const guildWelcomeChannels = new Map();
const guildWelcomeStrings = new Map();

module.exports = class WelcomeHandlerEvent extends BaseEvent {
    constructor () {
        super('guildMemberAdd');
        this.connection = StateManager.connection;
    }
    async run (client, member) {
        var welcomeChannel = member.guild.channels.cache.get(guildWelcomeChannels.get(member.guild.id));
        if(!welcomeChannel)return;
        const xSize = 1024;
        const ySize = 380;
        const borderSize = 2;
        const rectPadding = 15;
        const welcomeTextSize = 50;
        const avatarSize = 250;
        const cnvs = Canvas.createCanvas(xSize, ySize);
        const ctx = cnvs.getContext('2d');
        var grdnt = ctx.createLinearGradient(0, 0, xSize, ySize);
        grdnt.addColorStop(0, '#ff0000');
        grdnt.addColorStop(0.1, '#ff8800');
        grdnt.addColorStop(0.2, '#ffe100');
        grdnt.addColorStop(0.3, '#99ff00');
        grdnt.addColorStop(0.4, '#04ff00');
        grdnt.addColorStop(0.5, '#00ffa6');
        grdnt.addColorStop(0.6, '#00aaff');
        grdnt.addColorStop(0.7, '#000dff');
        grdnt.addColorStop(0.8, '#9000ff');
        grdnt.addColorStop(0.9, '#ff00d9');
        grdnt.addColorStop(1, '#ff0000');
        const bg = await Canvas.loadImage(path.resolve(__dirname, '../../assets/img/rainbow.jpg'));
        ctx.drawImage(bg, 0, 0, cnvs.width, cnvs.height);
        ctx.strokeStyle = grdnt;
        ctx.lineWidth = borderSize;
        ctx.strokeRect(rectPadding, rectPadding, xSize - rectPadding * 2, ySize - rectPadding * 2);
        ctx.font = `${welcomeTextSize}px sans-serif`;
	    ctx.fillStyle = grdnt;
	    ctx.fillText(`Welcome on ${member.guild}`, (ySize - avatarSize) + avatarSize, (ySize - avatarSize) / 2 + welcomeTextSize / 1.5);
        ctx.font = formatText(cnvs, (ySize - avatarSize) * 1.5 + avatarSize, `${member.displayName}`);
	    ctx.fillStyle = grdnt;
	    ctx.fillText(`${member.displayName}`, (ySize - avatarSize) + avatarSize, cnvs.height / 1.4);
        ctx.lineWidth = borderSize  * 2;
        ctx.beginPath();
        ctx.arc(ySize / 2, ySize / 2, (avatarSize / 2), 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ySize / 2, ySize / 2, (avatarSize - borderSize) / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 }));
        ctx.drawImage(avatar,(ySize - avatarSize) / 2, ySize / 2 - avatarSize / 2, avatarSize, avatarSize);
        const attachment = new MessageAttachment(cnvs.toBuffer(), 'welcome.jpg');
        const currentGuild = client.guilds.cache.get(member.guild.id);
        const memberCount = currentGuild.members.cache.filter(member => !member.user.bot).size;
        var welcomeString = guildWelcomeStrings.get(member.guild.id);
        if(welcomeString){
            welcomeString = welcomeString.replace('{member}', `${member}`).replace('{server}', `${currentGuild.name}`);
        }
        const fields = [
            {
                name: `${member.user.username} you're Member ${memberCount}!`,
                value: `${welcomeString}` 
            }
        ]
        const embed = await Embd.medium(
            Embd.type.normal,
            `Welcome on ${member.guild}!`,
            fields,
            null,
            `attachment://${attachment.name}`,
            true
        );
        welcomeChannel.send({ embeds: [embed], files: [attachment] });
    }
}
const formatText = (cnvs, dist, text) => {
	const ctx = cnvs.getContext('2d');
	let fontSize = 150;
	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > cnvs.width - dist);
	return ctx.font;
};

StateManager.on('welcomeChannelFetched', (guildId, welcomeChannelId) => {
    guildWelcomeChannels.set(guildId, welcomeChannelId);
})
StateManager.on('welcomeChannelUpdated', (guildId, welcomeChannel) => {
    guildWelcomeChannels.set(guildId, welcomeChannel);
})
StateManager.on('welcomeStringFetched', (guildId, welcomeString) => {
    guildWelcomeStrings.set(guildId, welcomeString);
})
StateManager.on('welcomeStringUpdated', (guildId, welcomeString) => {
    guildWelcomeStrings.set(guildId, welcomeString);
})