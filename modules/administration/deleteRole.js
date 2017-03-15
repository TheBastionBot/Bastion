/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = function(Bastion, message, args) {
  if (!message.guild.members.get(message.author.id).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) return;

  if (!(role = message.mentions.roles.first())) role = message.guild.roles.find('name', args.join(' '));
  if (role == null) return Bastion.log.info('No role found with that name.');
  if (message.guild.members.get(Bastion.user.id).highestRole.position <= role.position) return Bastion.log.info('I don\'t have permissions to use this command on my superiors.');

  role.delete().then(r => message.channel.sendMessage('', {embed: {
    color: 13380644,
    title: 'Role Deleted',
    fields: [
      {
        name: 'Name',
        value: r.name
      }
    ]
  }})).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['dr']
};

exports.help = {
  name: 'deleterole',
  description: 'Deletes a role by a given name.',
  permission: 'Manage Roles',
  usage: 'deleteRole <Role Name>',
  example: ['deleteRole Role Name']
};
