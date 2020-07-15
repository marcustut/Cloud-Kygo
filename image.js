const { Client, MessageEmbed } = require('discord.js');
const imagebot = new Client();

const cheerio = require('cheerio');
const request = require('request');

const PREFIX = process.env.prefix;

imagebot.on('ready', () => {
    console.log("IMAGE ONLINE");
});

imagebot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'search':
            message.delete();
            if(!imagebot.channels.cache.get('732201985889140767')) {
                message.channels.send("You can only use this command in Photo Channel");
                return;
            };

            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=pinterest" + args[1],
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            };

            request(options, function(error, response, responseBody) {
        
                if (error) {
                    return;
                }
        
                $ = cheerio.load(responseBody);
         
                var links = $(".image a.link");
        
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
                if (!urls.length) {
                    return;
                }
                //RESULT
                let photoChannel = imagebot.channels.cache.get('732201985889140767');
                    const photoEmbed = new MessageEmbed()
                    .setImage( urls[Math.floor(Math.random() * urls.length)])
                    .setColor(0xE5C918)
                    .setFooter(`${message.author.username}`)
                    .setTimestamp();
                    photoChannel.send(photoEmbed);
            });
            break;
    }
});

imagebot.login(process.env.token);