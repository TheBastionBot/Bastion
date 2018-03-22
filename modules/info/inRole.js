/**
 * @file inRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (!args.role) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find('name', args.role.join(' '));
  }

  if (role) {
    let members = role.members.map(m => m.user.tag).map((m, i) => `${i + 1}. ${m}`);

    let noOfPages = members.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `Members in ${role.name} role:\n`,
        description: members.slice(i * 10, (i * 10) + 10).join('\n'),
        thumbnail: {
          url: `https://dummyimage.com/250/${role.hexColor.slice(1)}/&text=%20`
        },
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, alias: 'r', multiple: true, defaultOption: true },
    { name: 'page', type: Number, alias: 'p', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'inRole',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'inRole < Role Name | @role-mention > [-p <PAGE_NO>]',
  example: [ 'inRole Legends -p 2', 'inrole @Legendary Heroes' ]
};
