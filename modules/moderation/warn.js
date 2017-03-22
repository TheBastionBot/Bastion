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

let guilds = new Object();

exports.run = function(Bastion, message, args) {
  if (!message.guild.members.get(message.author.id).hasPermission("KICK_MEMBERS")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  if (!(user = message.mentions.users.first())) return;
  if (!message.guild.members.get(user.id).kickable) return;

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) reason = 'No reason given';

  if (!guilds.hasOwnProperty(message.guild.id))
    guilds[message.guild.id] = new Object();
  if (!guilds[message.guild.id].hasOwnProperty(user.id)) guilds[message.guild.id][user.id] = 1;
  else {
    if (guilds[message.guild.id][user.id] == 2)
      message.guild.members.get(user.id).kick().then(member => {
        message.channel.sendMessage('', {embed: {
          color: 15451167,
          title: 'Kicked',
          fields: [
            {
              name: 'User',
              value: `**${user.username}**#${user.discriminator}`,
              inline: true
            },
            {
              name: 'ID',
              value: user.id,
              inline: true
            },
            {
              name: 'Reason',
              value: 'Warned 3 times!',
              inline: false
            }
          ]
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
        member.sendMessage('', {embed: {
          color: 15451167,
          title: `Kicked from ${message.guild.name} Server`,
          fields: [
            {
              name: 'Reason',
              value: 'You have been warned 3 times!'
            }
          ]
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    else guilds[message.guild.id][user.id] += 1;
  }
  message.channel.sendMessage('', {embed: {
    color: 14845440,
    title: 'Warning',
    description: `${user} have been warned by ${message.author} for **${reason}**.`
  }}).then(() => {
    user.sendMessage('', {embed: {
      color: 14845440,
      title: 'Warning',
      description: `You have been warned!`,
      fields: [
        {
          name: 'Reason',
          value: reason
        },
        {
          name: 'Server',
          value: message.guild.name
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.conf = {
  aliases: ['w']
};

exports.help = {
  name: 'warn',
  description: 'Warns a mentioned user with an optional reason. After 3 warnings are given, the users automatically gets kicked from the server.',
  permission: 'Kick Members',
  usage: 'warn @user-mention [Reason]',
  example: ['warn @user#0001 Reason for the warning.']
};
