const { Client, MessageEmbed }= require('discord.js');
const main = new Client;

const PREFIX = process.env.prefix;

main.once('ready', () =>{
    console.log("KYGO ARE ONLINE!");
});

main.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(/ +/);

    switch(args[0]){
        case 'announce':
            if(!message.member.roles.cache.get('730940617030500379')){
                message.delete();
                message.channel.send(message.author.username + " don't perm to announce");
                return;
            }
            let announceArgs = args.slice(1).join(" ");
                const announceEmbed = new MessageEmbed()
                .setDescription(announceArgs);
            let announceChannel = main.channels.cache.get('730940617034825777');
            announceChannel.send(announceEmbed);
    }
});

main.login(process.env.token);