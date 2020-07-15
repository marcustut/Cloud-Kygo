const { Client }= require('discord.js');
const main = new Client;

const PREFIX = process.env.prefix;

var announce = require('./commands/announce')
var poll = require('./commands/poll')
var event = require('./commands/event')
// var image = require('./commands/image')

main.once('ready', () =>{
    console.log("KYGO ARE ONLINE!");
});

main.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");
    const command = args.shift().toLowerCase();

    if(command === 'announce'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send("What do you want to announce?");
        } else {
            let announceWhosend = message.author.username;
            let announceArgs = args.slice(0).join(" ");
            let announceChannel = main.channels.cache.get('730940617034825777');
            return announceChannel.send(announce.announce(announceArgs, announceWhosend));
        }
    }
    if(command === 'poll'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send("What poll you want to create?");
        } else {
            let pollWhosend = message.author.username;
            let pollArgs = args.slice(0).join(" ");
            let pollChannel = main.channels.cache.get('730957158044401704');
            return pollChannel.send(poll.poll(pollArgs, pollWhosend));
        }
    }
    if(command === 'event'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send("What event you want to broadcast?");
        } else {
            let eventWhosend = message.author.username;
            let eventArgs = args.slice(0).join(" ");
            let eventChannel = main.channels.cache.get('730940617181364274');
            return eventChannel.send(event.event(eventArgs, eventWhosend));
        }
    }
});

main.login(process.env.token);