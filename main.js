// Modules for Discord
const { Client, MessageEmbed }= require('discord.js');
const main = new Client;

// Firebase Config
const firebase = require('firebase-admin');
const { firebaseConfig } = require('./firebase-config.json');
const serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

// 3rd Party Modules
const cheerio = require('cheerio');
const request = require('request');

// Self defined modules
const announce = require('./commands/announce')
const poll = require('./commands/poll')
const event = require('./commands/event')

// Getting Environment Variables
const PREFIX = process.env.d_PREFIX;
const discordToken = process.env.d_TOKEN;

main.once('ready', () =>{
    console.log("KYGO ARE ONLINE!");
});

main.on('message', async message =>{
    let args = message.content.substring(PREFIX.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if(command === 'announce'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send(process.env.prefix + "announce <channel> <message>");
        } else {
            let announceWhosend = message.author.username
            let announceArgs = args.slice(1).join(" ")
            let announceChannel = message.mentions.channels.first()
            if(!announceChannel){
                return message.channel.send("I believe that channel did not exist!")
            } else {
                return announceChannel.send(announce.announce(announceArgs, announceWhosend))
            }
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
            let pollArgs = args.slice(1).join(" ");
            let pollChannel = message.mentions.channels.first()
            if(!pollChannel){
                return message.channel.send("I believe that channel did not exist")
            } else {
                return pollChannel.send(poll.poll(pollArgs, pollWhosend));
            }
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
            let eventArgs = args.slice(1).join(" ");
            let eventChannel = message.mentions.channels.first()
            if(!eventChannel){
                return message.channel.send("I believe that channel did not exist")
            } else {
                return eventChannel.send(event.event(eventArgs, eventWhosend));
            }
        }
    }
    if(command === 'search'){
        if(!args.length){
            return message.channel.send("What image you want me to search?");
        } else {
            message.delete();
            let searchArgs = args.slice(0).join(" ");
            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=pinterest" + searchArgs,
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            }
            request(options, function(error, response, responseBody) {

                if (error) {
                    return
                }
    
                $ = cheerio.load(responseBody)
        
                var links = $(".image a.link")
    
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"))
                if (!urls.length) {
                    return
                }
                let imageChannel = main.channels.cache.get('732201985889140767');
                const searchEmbed = new MessageEmbed()
                .setImage( urls[Math.floor(Math.random() * urls.length)])
                .setColor(0xE5C918)
                .setFooter(message.author.username)
                .setTimestamp();
                imageChannel.send(searchEmbed);
            })
        }
    }
    if (message.content.startsWith('$suggestion')) {
        // Parsing data from template message
        const parsedMesssage = message.content.trim().split('\n');
        const user = {
            IGN: parsedMesssage[1].split(':')[1].trim(),
            suggestion: parsedMesssage[2].split(':')[1].trim(),
            reason: parsedMesssage[3].split(':')[1].trim()
        };

        try {
            // Specifying the collections
            const commandsCollection = db.doc('/discord/commands');
            const commandsDoc = await commandsCollection.get();
            const suggestionCollection = db.collection('/discord/commands/suggestions').doc(`suggestion${commandsDoc.data().suggestionsCount + 1}`);

            // Creating a new document
            await suggestionCollection.set({
                'id': commandsDoc.data().suggestionsCount + 1,
                'username': message.author.username,
                'userID': message.author.id,
                'userAvatar': message.author.displayAvatarURL(),
                'IGN': user.IGN,
                'date': new Date(),
                'suggestion': user.suggestion,
                'reason': user.reason,
                'response': null
            });

            // Creating a Embed reply to user
            const suggestionEmbed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(`Suggestion #${commandsDoc.data().suggestionsCount + 1}`)
                .setDescription(`IGN: ${user.IGN}\nSuggestion: ${user.suggestion}\nReason: ${user.reason}`)
                .setFooter(main.user.username, main.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(suggestionEmbed).then(embedMessage => {
                embedMessage.react("⬆️");
                embedMessage.react("⬇️");
            });

            // Logging the result
            console.log(`Suggestion#${commandsDoc.data().suggestionsCount} by ${message.author.tag} at ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Kuala_Lumpur', timeZoneName: 'short'}).format(new Date())} (A new suggestion is issued)`)

            // Increment suggestionsCount 
            commandsCollection.update({
                'suggestionsCount': commandsDoc.data().suggestionsCount + 1
            });

            return;
        } catch (error) {
            console.log(error.message);
            return message.channel.send('An Error Occured\nMake sure your template is correct.');
        }
    }
});

main.login(discordToken);