const { MessageEmbed } = require('discord.js');

const type = {
    normal: '#248EA4',
    warning: '#BB840D',
    error: '#801313'
}

async function short(type = type.normal, title = '', embdMsg = ''){
    const Embed = new MessageEmbed()
        .setColor(type)
        .setTitle(title)
        .setDescription(embdMsg)
    return Embed;
}
async function medium(type = type.normal, title = '', fields = [], thumbnail = '', img, time = true){
    const Embed = new MessageEmbed()
        .setColor(type)
        .setTitle(title)
        .addFields(fields)
    if(thumbnail != null){
        Embed.setThumbnail(thumbnail);
    }
    if(img){
        Embed.setImage(img);
    }
    if(time){
        Embed.setTimestamp();
    }
    return Embed;
}

module.exports = {type, short, medium}