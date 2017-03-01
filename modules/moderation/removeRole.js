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
  if (args.length < 1) return;
  if (!message.guild.members.get(message.author.id).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (!(user = message.mentions.users.first())) {
    user = message.author;
    role = args.join(' ');
  }
  else role = args.slice(1).join(' ');
  role = message.guild.roles.find('name', role);
  if (role == null) return Bastion.log.info('No role found with that name.');
  if (message.guild.members.get(Bastion.user.id).highestRole.position <= role.position) return Bastion.log.info('I don\'t have permissions to use this command on my superiors.');

  message.guild.members.get(user.id).removeRole(role).then(() => {
    message.channel.sendMessage('', {embed: {
      color: 13380644,
      title: 'Role Removed',
      description: `**${user.username}**#${user.discriminator} has now been removed from **${role.name}** role.`,
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['rmr']
};

exports.help = {
  name: 'removerole',
  description: 'Removes a user from a given role. If no user is mentioned, removes you from the given role.',
  permission: 'Manage Roles',
  usage: ['removeRole @user#0001 Role Name', 'addRole Role Name']
};
