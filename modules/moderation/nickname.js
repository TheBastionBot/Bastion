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
  if (!message.member.hasPermission('MANAGE_NICKNAMES')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (!(user = message.mentions.users.first())) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.slice(1);
  let color;
  let nickStat = '';
  if (args.length < 1) {
    color = Bastion.colors.red;
    nickStat = `${user}'s nickname removed.`;
  }
  else {
    color = Bastion.colors.green;
    nickStat = `${user}'s nickname changed.`;
  }
  message.guild.members.get(user.id).setNickname(args.join(' ')).then(member => {
    message.channel.send({embed: {
      color: color,
      description: nickStat
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['nick']
};

exports.help = {
  name: 'nickname',
  description: 'Change the nickname of the mentioned user in the server to a specified nick. If no nick is specified, it resets the user\'s nickname.',
  botPermission: 'Manage Nicknames',
  userPermission: 'Manage Nicknames',
  usage: 'nickname <@user-mention> [nick]',
  example: ['nickname @user#0001 The Legend', 'nickname @user#0001']
};
