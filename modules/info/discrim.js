/**
 * @file discrim command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (!/^\d{4}$/.test(args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let members = message.guild.members.filter(m => m.user.discriminator === args[0]).map(m => m.user.tag);
  let total = members.length;
  members = members.length > 0 ? members.slice(0, 10).join('\n') : 'None';

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Discriminator search',
      description: `Found **${total}** users with discriminator **${args[0]}**`,
      fields: [
        {
          name: 'Users',
          value: total > 10 ? `${members} and ${total - 10} more.` : members
        }
      ]
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
  name: 'discrim',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'discrim <discriminator>',
  example: [ 'discrim 8383' ]
};
