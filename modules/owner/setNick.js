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
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  if (args.length > 0) {
    message.guild.members.get(Bastion.user.id).setNickname(args.join(' ')).then(() => {
      message.channel.send({embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username}'s nick is now set to **${args.join(' ')}** on this guild.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.guild.members.get(Bastion.user.id).setNickname('').then(() => {
      message.channel.send({embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username}'s nick has been reset on this guild.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['setn']
};

exports.help = {
  name: 'setnick',
  description: 'Sets the nick of the bot in the current guild. If no nick is given, it resets the nickname.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'setNick [text]',
  example: ['setNick NewNick', 'setNick']
};
