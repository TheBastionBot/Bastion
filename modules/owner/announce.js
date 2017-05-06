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
  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  for (let i = 0; i < Bastion.guilds.size; i++) {
    Bastion.guilds.map(g => g.defaultChannel)[i].send({embed: {
      color: Bastion.colors.blue,
      description: args.join(' ')
    }}).catch(() => {});
  }

  message.channel.send({embed: {
    color: Bastion.colors.green,
    title: 'Announced',
    description: args.join(' ')
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['notify'],
  enabled: true
};

exports.help = {
  name: 'announce',
  description: 'Sends a message to all servers\' default channel, the bot is connected to.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'announce <message>',
  example: ['announce Just a random announcement.']
};
