/**
 * @file setUsername command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  if (args.join(' ').length >= 1) {
    Bastion.user.setUsername(args.join(' ')).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${Bastion.user.username}'s username is now set to **${args.join(' ')}**`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'setun' ],
  enabled: true
};

exports.help = {
  name: 'setusername',
  description: 'Give a new username to the bot. (NOTE: It\'s Rate limited. You can only change it two times in an hour.)',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'setUsername <text>',
  example: [ 'setUsername NewUsername' ]
};
