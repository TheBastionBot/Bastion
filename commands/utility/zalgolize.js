/**
 * @file zalgolize command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Zalgolized Text',
      description: Bastion.methods.zalgolize(args.join(' '))
    }
  });
};

exports.config = {
  aliases: [ 'zalgo' ],
  enabled: true
};

exports.help = {
  name: 'zalgolize',
  description: 'Sends the same message that you had sent, but zalgolized.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'zalgolize <text>',
  example: [ 'zalgolize It looks clumsy, but it\'s cool!' ]
};
