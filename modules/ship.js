/**
 * @file ship command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let users = message.mentions.users.map(u => u.username);
  if (users.length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let shippedName = '';
  for (let i = 0; i < users.length; i++) {
    shippedName += `${users[i].substring(0, users[i].length / 2)}`;
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Shipped Users',
      description: `${users.join(' + ')} = **${shippedName}**`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ship',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ship <USER_MENTION> <USER_MENTION> [...USER_MENTION]',
  example: [ 'ship user#0001 user#0002 user#0003' ]
};
