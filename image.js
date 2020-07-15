const { Client, MessageEmbed } = require('discord.js');
const imagebot = new Client();

const cheerio = require('cheerio');
const request = require('request');

const PREFIX = '$';

imagebot.on('ready', () => {
    console.log("IMAGE ONLINE");
});

imagebot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'search':
            message.delete();
            if(!imagebot.channels.cache.get('732201985889140767')){
                return;
            };
            if(!args[1]){
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
                let catsChannel = imagebot.channels.cache.get('732201985889140767');
                    const catsEmbed = new MessageEmbed()
                    .setImage( urls[Math.floor(Math.random() * urls.length)])
                    .setColor(0xE5C918)
                    .setFooter(`${message.author.username}`)
                    .setTimestamp();
                    catsChannel.send(catsEmbed);
            });
            break;
    }
});

imagebot.login(process.env.token);