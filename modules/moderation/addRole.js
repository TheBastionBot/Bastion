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

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (!(user = message.mentions.users.first())) {
    user = message.author;
    role = args.join(' ');
  }
  else {
    role = args.slice(1).join(' ');
  }
  role = message.guild.roles.find('name', role);
  if (role == null) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.red,
      description: 'No role found with that name.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.members.get(user.id).addRole(role).then(() => {
    message.channel.sendMessage('', {embed: {
      color: Bastion.colors.green,
      title: 'Role Added',
      description: `**${user.username}**#${user.discriminator} has now been given **${role.name}** role.`,
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });

    sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
      if (!row) return;

      if (row.modLog == 'true') {
        message.guild.channels.get(row.modLogChannelID).sendMessage('', {embed: {
          color: Bastion.colors.green,
          title: 'Role Added',
          description: `Case Number: ${row.modCaseNo}`,
          fields: [
            {
              name: 'User',
              value: `${user}`,
              inline: true
            },
            {
              name: 'User ID',
              value: user.id,
              inline: true
            },
            {
              name: 'Reason',
              value: role.name
            },
            {
              name: 'Responsible Moderator',
              value: `${message.author}`,
              inline: true
            },
            {
              name: 'Moderator ID',
              value: message.author.id,
              inline: true
            }
          ]
        }}).then(msg => {
          sql.run(`UPDATE guildSettings SET modCaseNo=${parseInt(row.modCaseNo)+1} WHERE guildID=${message.guild.id}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    message.channel.sendMessage('', {embed: {
      color: Bastion.colors.red,
      description: 'I don\'t have enough permission to do that operation.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['ar']
};

exports.help = {
  name: 'addrole',
  description: 'Adds a mentioned user to the given role. If no user is mentioned, adds you to the given role.',
  permission: 'Manage Roles',
  usage: 'addRole [@user-mention] <Role Name>',
  example: ['addRole @user#001 Role Name', 'addRole Role Name']
};
