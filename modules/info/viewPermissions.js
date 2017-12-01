/**
 * @file viewPermissions command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let fields = [];
  let permissions = message.member.permissions.serialize();
  for (let permission in permissions) {
    fields.push({
      name: permission.replace(/_/g, ' ').toTitleCase(),
      value: permissions[permission],
      inline: true
    });
  }
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Permissions for ${message.author.tag}`,
      description: 'Permissions you have in this channel and server.',
      fields: fields
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'viewPerms' ],
  enabled: true
};

exports.help = {
  name: 'viewPermissions',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'viewPermissions',
  example: []
};
