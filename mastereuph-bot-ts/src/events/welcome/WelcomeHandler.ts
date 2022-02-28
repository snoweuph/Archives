import Client from '../../types/Client';
import BaseEvent from '../../base/classes/BaseEvent';
import StateManager from '../../base/StateManager';
import Canvas, { CanvasGradient, Image } from 'canvas';
import Path from 'path';
import Embeds from '../../utils/Embeds';
import { EmbedFieldData, MessageAttachment } from 'discord.js';
import EmbedType from '../../types/EmbedTypes';

const guildWelcomeMessageEnabledMap = new Map<string, boolean>();
const guildWelcomeMessageChannelIdMap = new Map<string, string>();
const guildWelcomeMessageTitleMap = new Map<string, string>();
const guildWelcomeMessageContentMap = new Map<string, string>();
const guildWelcomeMessageEmbedColorMap = new Map<string, string>();

const guildWelcomeMessageImageEnabledMap = new Map<string, boolean>();
const guildWelcomeMessageImageUrlMap = new Map<string, string>();
const guildWelcomeMessageImageAccentColorMap = new Map<string, string>();

export default class WelcomeHandlerEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }

    async execute(client: Client, ...args: any[]): Promise<void> {
        const guildId = args[0].guild.id;
        if (!guildWelcomeMessageEnabledMap.get(guildId)) return;
        if (!guildWelcomeMessageChannelIdMap.get(guildId)) return;
        const welcomeChannel = args[0].guild.channels.cache.get(guildWelcomeMessageChannelIdMap.get(guildId))
        if (!welcomeChannel) return;
        const member = args[0];

        const xSize = 1024;
        const ySize = 380;
        const borderSize = 2;
        const rectPadding = 15;
        const welcomeTextSize = 50;
        const avatarSize = 250;
        const cnvs = Canvas.createCanvas(xSize, ySize);
        const ctx = cnvs.getContext('2d');

        let attachment: MessageAttachment;
        let attachmentString: string;

        if (guildWelcomeMessageImageEnabledMap.get(guildId)) {
            var color: string | CanvasGradient;
            if (guildWelcomeMessageImageAccentColorMap.get(guildId) == 'rainbow') {
                color = ctx.createLinearGradient(0, 0, xSize, ySize);
                color.addColorStop(0, '#ff0000');
                color.addColorStop(0.1, '#ff8800');
                color.addColorStop(0.2, '#ffe100');
                color.addColorStop(0.3, '#99ff00');
                color.addColorStop(0.4, '#04ff00');
                color.addColorStop(0.5, '#00ffa6');
                color.addColorStop(0.6, '#00aaff');
                color.addColorStop(0.7, '#000dff');
                color.addColorStop(0.8, '#9000ff');
                color.addColorStop(0.9, '#ff00d9');
                color.addColorStop(1, '#ff0000');
            } else {
                color = guildWelcomeMessageImageAccentColorMap.get(guildId);
            }
            let bg: Image;
            if (!guildWelcomeMessageImageUrlMap.get(guildId)) {
                bg = await Canvas.loadImage(Path.resolve(__dirname, '../../../assets/img/rainbow.jpg'));
            } else {
                try {
                    bg = await Canvas.loadImage(guildWelcomeMessageImageUrlMap.get(guildId));
                } catch (error) {
                    return;
                }
            }
            ctx.drawImage(bg, 0, 0, cnvs.width, cnvs.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = borderSize;
            ctx.strokeRect(rectPadding, rectPadding, xSize - rectPadding * 2, ySize - rectPadding * 2);
            ctx.font = `${welcomeTextSize}px sans-serif`;
            ctx.fillStyle = color;
            ctx.fillText(`Welcome on ${member.guild}`, (ySize - avatarSize) + avatarSize, (ySize - avatarSize) / 2 + welcomeTextSize / 1.5);
            ctx.font = formatText(cnvs, (ySize - avatarSize) * 1.5 + avatarSize, `${member.displayName}`);
            ctx.fillStyle = color;
            ctx.fillText(`${member.displayName}`, (ySize - avatarSize) + avatarSize, cnvs.height / 1.4);
            ctx.lineWidth = borderSize * 2;
            ctx.beginPath();
            ctx.arc(ySize / 2, ySize / 2, (avatarSize / 2), 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(ySize / 2, ySize / 2, (avatarSize - borderSize) / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 }));
            ctx.drawImage(avatar, (ySize - avatarSize) / 2, ySize / 2 - avatarSize / 2, avatarSize, avatarSize);
            attachment = new MessageAttachment(cnvs.toBuffer(), 'welcome.jpg');
            attachmentString = 'attachment://' + attachment.name;
        }

        const currentGuild = client.client.guilds.cache.get(guildId);
        const memberCount = currentGuild.memberCount;
        var welcomeTitle = guildWelcomeMessageTitleMap.get(guildId);
        var welcomeContent = guildWelcomeMessageContentMap.get(guildId);
        /* {user} a ping to the new user
           {server} the name of the server
           {tag} the tag of the new user
           {count} the number of members in the server
        */
        welcomeTitle = await welcomeTitle.replace('{user}', `<@!${member.id}>`).replace('{server}', currentGuild.name).replace('{tag}', member.user.tag).replace('{count}', memberCount.toString());
        welcomeContent = await welcomeContent.replace('{user}', `<@!${member.id}>`).replace('{server}', currentGuild.name).replace('{tag}', member.user.tag).replace('{count}', memberCount.toString());
        const fields: Array<EmbedFieldData> = [
            {
                name: welcomeTitle,
                value: welcomeContent
            }
        ]
        const embed = await Embeds.medium(
            EmbedType.NORMAL,
            `Welcome on ${currentGuild.name}!`,
            fields,
            null,
            attachmentString,
            true
        );
        if (attachment) {
            welcomeChannel.send({ embeds: [embed], files: [attachment] });
        } else {
            welcomeChannel.send({ embeds: [embed] });
        }
    }
}
const formatText = (cnvs: Canvas.Canvas, dist: number, text: string) => {
    const ctx = cnvs.getContext('2d');
    let fontSize = 150;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > cnvs.width - dist);
    return ctx.font;
};

StateManager.on('welcomeMessageEnabledFetched', (guildId: string, welcomeMessageEnabled: boolean) => {
    guildWelcomeMessageEnabledMap.set(guildId, welcomeMessageEnabled);
});
StateManager.on('welcomeMessageChannelIdFetched', (guildId: string, welcomeMessageChannelId: string) => {
    guildWelcomeMessageChannelIdMap.set(guildId, welcomeMessageChannelId);
});
StateManager.on('welcomeMessageTitleFetched', (guildId: string, welcomeMessageTitle: string) => {
    guildWelcomeMessageTitleMap.set(guildId, welcomeMessageTitle);
});
StateManager.on('welcomeMessageContentFetched', (guildId: string, welcomeMessageContent: string) => {
    guildWelcomeMessageContentMap.set(guildId, welcomeMessageContent);
});
StateManager.on('welcomeMessageEmbedColorFetched', (guildId: string, welcomeMessageEmbedColor: string) => {
    guildWelcomeMessageEmbedColorMap.set(guildId, welcomeMessageEmbedColor);
});

StateManager.on('welcomeMessageImageEnabledFetched', (guildId: string, welcomeMessageImageEnabled: boolean) => {
    guildWelcomeMessageImageEnabledMap.set(guildId, welcomeMessageImageEnabled);
});
StateManager.on('welcomeMessageImageUrlFetched', (guildId: string, welcomeMessageImageUrl: string) => {
    guildWelcomeMessageImageUrlMap.set(guildId, welcomeMessageImageUrl);
});
StateManager.on('welcomeMessageImageAccentColorFetched', (guildId: string, welcomeMessageImageAccentColor: string) => {
    guildWelcomeMessageImageAccentColorMap.set(guildId, welcomeMessageImageAccentColor);
});