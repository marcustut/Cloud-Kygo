const { MessageEmbed } = require("discord.js");

module.exports = {
    announce: function(msg, who) {
        const announceEmbed = new MessageEmbed()
        .setAuthor("**NEW UPDATE**", "https://i.imgur.com/zpB4dbi.png")
        .setDescription(msg)
        .setColor(0xFFC300)
        .setFooter(who)
        .setTimestamp()
        return announceEmbed;
    }
}