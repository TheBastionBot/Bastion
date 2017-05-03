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

  if (args.length >= 1 && (args === 'online' || args === 'idle' || args === 'dnd' || args === 'invisible') ) {
    Bastion.user.setStatus(args.join(' ')).then(() => {
      message.channel.send({embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username}'s status is now set to **${args.join(' ')}**`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    Bastion.user.setStatus(Bastion.config.status).then(() => {
      message.channel.send({embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username}'s status is now set to the default status **${Bastion.config.status}**`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'setstatus',
  description: 'Sets the bot\'s status to the given status (online/idle/dnd/invisible). If no status is given as the argument, it will set the bot\'s status to default (given in `config.json`).',
  botPermission: '',
  permission: 'Bot Owner',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: ['setStatus invisible', 'setStatus']
};
