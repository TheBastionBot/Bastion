var request = require('request');
var cheerio = require('cheerio')

function rnd_selection(base)
{
	return String(arguments[Math.floor(Math.random()*arguments.length)]);
}

exports.run = function(Bastion, message) {

  let user = message.mentions.users.first()
  
message.delete();    
message.reply(":mag_right:  Getting you a insult right now...").then(m => {
request.get('http://toykeeper.net/programs/mad/euphemisms', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          insult = cheerio.load(body)
		  mine = insult('blockquote').first().text().trim()
		  m.edit(`${user}`, {
				embed: {
					color: 
					rnd_selection(3447003, 14365491, 3201849, 13818670, 13577435, 7089371, 14383916),
					author: {
						name: Bastion.user.username,
						icon_url: Bastion.user.avatarURL
					},
					thumbnail: {
						url: ('https://lynnschneiderbooks.files.wordpress.com/2011/05/euphemism-misc1.jpg')
					},
					fields: [
						{
							name: 'Look at This!',
							value: `${mine}`
						}
					],
					timestamp: new Date(),
					footer: {
						text: 'We need a Nerd here!'
					}
				}
			});  
             if (error) {
         m.edit(":x: Error has Occured: ", error, ", code: ", response.statusCode);
        } 
          };
});
        })
}

exports.conf = {
  aliases: ['roast'],

};

 exports.help = {
    name: 'insult',
    usage: 'insult <user>',
    description: 'Insults Someone with soft words. (euphemism)'
    example: ['bas?invite @user']
    permission: '',
    
};   
