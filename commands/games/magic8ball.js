/**
 * @file magic8ball command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let outcomes = [
    'It\'s certain',
    'It\'s decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
  ];

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Magic 8-ball says...',
      description: `🎱 ${outcomes.getRandom()}`,
      footer: {
        text: `Asked by ${message.member.displayName}`
      }
    }
  });
};

exports.config = {
  aliases: [ '8ball' ],
  enabled: true
};

exports.help = {
  name: 'magic8ball',
  description: 'Get answers to your polar (yes/no) questions from the Magic 8-Ball.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'magic8ball <QUESTION>',
  example: [ 'magic8ball Do I need a new lease on life?' ]
};
