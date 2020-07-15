const { MessageEmbed } = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    image: function(searchthis, whosend) {
        var options = {
            url: "http://results.dogpile.com/serp?qc=images&q=pinterest" + searchthis,
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
            const searchEmbed = new MessageEmbed()
            .setImage( urls[Math.floor(Math.random() * urls.length)])
            .setColor(0xE5C918)
            .setFooter(whosend)
            .setTimestamp();
            return {searchEmbed};
        });
    }
};