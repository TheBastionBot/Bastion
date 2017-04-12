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
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('You don\'t have permissions to use this command.');

  message.channel.sendMessage('', {embed: {
    color: 14845440,
    description: 'Are you sure you want to shut me down?'
  }}).then(msg => {
    const collector = msg.channel.createCollector(m =>
      Bastion.credentials.ownerId.includes(m.author.id) && (m.content.startsWith('yes') || m.content.startsWith('no')),
      {
        time: 30 * 1000,
        maxMatches: 1
      }
    );
    collector.on('message', (answer, collector) => {
      if (answer.content.startsWith('yes')) {
        message.channel.sendMessage('', {embed: {
          color: 11316394,
          description: 'GoodBye :wave:! See you soon.'
        }}).then(() => {
          Bastion.destroy().catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      else {
        message.channel.sendMessage('', {embed: {
          color: 14211540,
          description: 'Cool! I\'m here.'
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['die', 'turnoff']
};

exports.help = {
  name: 'shutdown',
  description: 'Shuts the bot down and terminates the process.',
  permission: '',
  usage: 'shutdown',
  example: []
};
