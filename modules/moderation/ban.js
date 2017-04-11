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
  if (!message.member.hasPermission("BAN_MEMBERS")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  if (!(user = message.mentions.users.first())) {
    return message.channel.sendMessage('', {embed: {
      color: 15451167,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (!message.guild.members.get(user.id).bannable) {
    return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: `I don't have permissions to ban ${user}.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.members.get(user.id).ban(7).then(member => {
    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    message.channel.sendMessage('', {embed: {
      color: 13380644,
      title: 'Banned',
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
          value: reason,
          inline: false
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
    member.sendMessage('', {embed: {
      color: 13380644,
      title: `Banned from ${message.guild.name} Server`,
      description: `**Reason:** ${reason}`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['b']
};

exports.help = {
  name: 'ban',
  description: 'Bans a mentioned user with an optional reason, and removes 7 days of his message history.',
  permission: 'Ban Members',
  usage: 'ban <@user-mention> [Reason].',
  example: ['ban @user#001 Reason for the ban.']
};
