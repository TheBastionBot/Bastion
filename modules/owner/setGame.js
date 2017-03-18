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
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (args.length >= 1) {
    Bastion.user.setGame(args.join(' ')).then(() => {
      message.channel.sendMessage('', {embed: {
        color: 14211540,
        description: `${Bastion.user.username}'s game is now set to **${args.join(' ')}**`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    Bastion.user.setGame(Bastion.config.game).then(() => {
      message.channel.sendMessage('', {embed: {
        color: 14211540,
        description: `${Bastion.user.username}'s game is now set to the default game **${Bastion.config.game}**`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.conf = {
  aliases: ['setg']
};

exports.help = {
  name: 'setgame',
  description: 'Sets the bot\'s game to the given text. If no text is given, sets the bot\'s game to the default game (given in `config.json`).',
  permission: '',
  usage: 'setGame [text]',
  example: ['setGame with minions!', 'setGame']
};
