/**
 * @file contributors command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let contributors = await Bastion.methods.getContributors();
  contributors = contributors.map(contributor => `**${contributor.username}** - ${contributor.contributions} contributions`);

  let noOfPages = contributors.length / 25;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  await message.channel.send({
    embed: {
      color: 10181046,
      title: 'The Bastion Bot Project',
      url: 'https://github.com/TheBastionBot',
      description: 'These are the people who contribute to the development of The Bastion Bot Project on [GitHub](https://github.com/TheBastionBot).',
      fields: [
        {
          name: 'Contributors',
          value: contributors.slice(i * 25, (i * 25) + 25).join('\n')
        }
      ],
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • https://github.com/TheBastionBot`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'contributors',
  description: 'Shows the list of people who contribute to the development of The Bastion Bot Project on [GitHub](%github.org%).',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'contributors',
  example: []
};
