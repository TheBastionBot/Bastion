/**
 * @file magic8ball command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 2 || !args.join(' ').endsWith('?')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
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

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: args.join(' '),
      description: outcomes[Math.floor(Math.random() * outcomes.length)],
      // description: outcomes.random(),
      footer: {
        text: '🎱 Magic 8-ball'
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ '8ball' ],
  enabled: true
};

exports.help = {
  name: 'magic8ball',
  description: 'Ask the Magic 8-Ball a polar (yes/no) question.',
  botPermission: '',
  userPermission: '',
  usage: 'magic8ball <Question>?',
  example: [ 'magic8ball Do I need a new lease on life?' ]
};
