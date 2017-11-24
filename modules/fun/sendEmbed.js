/**
 * @file sendEmbed command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userTextPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    args = JSON.parse(args.join(' '));
    args.footer = {
      text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from Bastion or from it\'s creators.'}`
    };
  }
  catch (e) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), `${Bastion.strings.error(message.guild.language, 'invalidEmbedObject', true)}\`\`\`${e.toString()}\`\`\``, message.channel);
  }

  message.channel.send({
    embed: args
  }).then(() => {
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e);
      });
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
  name: 'sendEmbed',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
