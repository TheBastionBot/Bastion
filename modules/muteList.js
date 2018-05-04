/**
 * @file muteList command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);

  let muteRole = message.guild.roles.find('name', 'Bastion:mute'), mutedMembers = [];
  if (muteRole) {
    mutedMembers = muteRole.members.map(member => member.user.tag);
  }

  if (mutedMembers.length) {
    mutedMembers = mutedMembers.map((l, i) => `**${i + 1}.**  ${l}`);

    let noOfPages = mutedMembers.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Muted Users',
        description: mutedMembers.join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'The list\'s empty! No one is currently muted in this server.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'muteList',
  botPermission: '',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'muteList [PAGE_NO]',
  example: [ 'muteList', 'muteList 2' ]
};
