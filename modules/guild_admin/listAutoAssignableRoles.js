/**
 * @file listAutoAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.autoAssignableRoles) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notSet', true, 'auto-assignable roles'), message.channel);
    }

    let roles = guildSettings.autoAssignableRoles.split(' ');
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];

    let roleNames = [];
    for (let i = 0; i < roles.length; i++) {
      roleNames.push(message.guild.roles.get(roles[i]).name);
    }
    roleNames = roleNames.map((r, i) => `${i + 1}. ${r}`);

    let noOfPages = roleNames.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Auto assignable roles:',
        description: roleNames.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'laar' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listAutoAssignableRoles',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'listAutoAssignableRoles [page_no]',
  example: [ 'listAutoAssignableRoles', 'listAutoAssignableRoles 2' ]
};
