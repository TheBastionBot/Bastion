/**
 * @file viewPermissions command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let fields = [];
  let permissions = message.member.permissions.serialize();
  for (let permission in permissions) {
    fields.push({
      name: permission.replace(/_/g, ' ').toTitleCase(),
      value: permissions[permission],
      inline: true
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Permissions for ${message.author.tag}`,
      description: 'Permissions you have in this channel and server.',
      fields: fields
    }
  });
};

exports.config = {
  aliases: [ 'viewPerms' ],
  enabled: true
};

exports.help = {
  name: 'viewPermissions',
  description: 'Shows the permissions you have in the server/channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'viewPermissions',
  example: []
};
