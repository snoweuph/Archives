import { EmbedFieldData, MessageEmbed } from "discord.js";

enum EmbedType {
    normal = '#248EA4',
    warning = '#BB840D',
    error = '#801313'
}


async function short(type: EmbedType, title: string, embdMsg: string) {
    const Embed = new MessageEmbed()
        .setColor(type)
        .setTitle(title)
        .setDescription(embdMsg)
    return Embed;
}

async function medium(type: EmbedType, title: string, fields: Array<EmbedFieldData>, thumbnail: string, img: string, time: boolean) {
    const Embed = new MessageEmbed()
        .setColor(type)
        .setTitle(title)
        .addFields(fields)
    if (thumbnail != null) {
        Embed.setThumbnail(thumbnail);
    }
    if (img) {
        Embed.setImage(img);
    }
    if (time) {
        Embed.setTimestamp();
    }
    return Embed;
}

export { EmbedType, short, medium };