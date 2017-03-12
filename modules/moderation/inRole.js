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

  if (role) {
    let users = [];
    for (let i = 0; i < role.members.size; i++)
    users.push(`**${role.members.map(r => r.user)[i].username}**#${role.members.map(r => r.user)[i].discriminator}`);

    message.channel.sendMessage('', {embed: {
      color: 6651610,
      title: `List of Members in ${role.name} role:\n`,
      description: users.join('\n')
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else return message.channel.sendMessage('', {embed: {
    color: 13380644,
    description: 'The specified role was not found.'
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'inrole',
  description: 'Shows the list of all the users in a specified role.',
  permission: '',
  usage: ['inRole Role Name', 'inrole @roleMention']
};
