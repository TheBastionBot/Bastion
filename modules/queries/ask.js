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

let activeChannels = [];

exports.run = (Bastion, message, args) => {
  if (args.length < 1) return;

  if(!activeChannels.includes(message.channel.id)) {
    args = args.join(' ').split(';');
    let opt = ['0⃣', '1⃣'];

    message.channel.sendMessage('', {embed: {
      color: 5088314,
      title: args.join(' '),
      description: 'React to this message with :one: to vote **YES**\n\nReact to this message with :zero: to vote **NO**'
    }}).then(m => {
      activeChannels.push(message.channel.id);
      try {
        for (let i = 0; i < opt.length; i++) m.react(opt[i]).catch(e => {
          Bastion.log.error(e.stack);
        });
      } finally {
        setTimeout(function () {
          let res = [];
          for (let i = 0; i < opt.length; i++)
            res.push(m.reactions.get(opt[i]).users.size - 1);
          message.channel.sendMessage('', {embed: {
            color: 6651610,
            title: args.join(' '),
            fields: [
              {
                name: 'Yes',
                value: res[1],
                inline: true
              },
              {
                name: 'No',
                value: res[0],
                inline: true
              }
            ]
          }}).then(m => {
            activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);
          }).catch(e => {
            Bastion.log.error(e.stack);
          });
        }, 60000);
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'Can\'t ask now. Another question is already in progress. Wait a minute for it to end.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'ask',
  description: 'Ask a polar (yes/no) question to the users and get votes. Shows you the result after a minute of getting votes.',
  permission: '',
  usage: 'ask <text>',
  example: ['ask Anyone want to play Call of Duty Infinity Warfare now?']
};
