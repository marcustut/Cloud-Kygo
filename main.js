const { Client, MessageEmbed }= require('discord.js');
const main = new Client;

const PREFIX = '$';

main.once('ready', () =>{
    console.log("KYGO ARE ONLINE!");
});

main.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(/ +/);

    switch(args[0]){
        case 'announce':
            const nopermEmbed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription("You don't have permission to use $announce");
            if(!message.member.roles.cache.get('730940617030500379')){
                message.delete();
                message.channel.send(nopermEmbed);
                message.delete(5000);
                return;
            }
            let announceArgs = args.slice(1).join(" ");
                const announceEmbed = new MessageEmbed()
                .setAuthor("**NEW UPDATE**", "https://i.imgur.com/zpB4dbi.png")
                .setDescription(announceArgs)
                .setFooter(message.author.username)
                .setTimestamp();
            let announceChannel = main.channels.cache.get('730940617034825777');
            announceChannel.send(announceEmbed);
            break;
        case 'poll':
            if(!message.member.roles.cache.get('730940617030500379')){
                message.delete();
                message.channel.send(nopermEmbed);
                message.delete(5000);
                return;
            }
            let pollArgs = args.slice(1).join(" ");
                const pollEmbed = new MessageEmbed()
                .setAuthor("**NEW POLL**", "https://i.imgur.com/zpB4dbi.png")
                .setDescription(pollArgs)
                .setFooter(message.author.username)
                .setTimestamp();
            let pollChannel = main.channels.cache.get('730957158044401704');
            pollChannel.send(pollEmbed);
            break;
        case "event":
            if(!message.member.roles.cache.get('730940617030500379')){
                message.delete();
                message.channel.send(nopermEmbed);
                message.delete(5000);
                return;
            }
            let eventmsgArgs = args.slice(1).join(" ");
                const eventEmbed = new MessageEmbed()
                .setColor(0xFFC300)
                .setAuthor("**" + "EVENT" + "**", "https://i.imgur.com/zpB4dbi.png")
                .setDescription(eventmsgArgs)
                .setTimestamp();
            let eventChannel = bot.channels.cache.get('730940617181364274');
                eventChannel.send(eventEmbed);
                break;
    }
});

main.login(process.env.token);