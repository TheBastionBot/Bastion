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

exports.run = function(Bastion, message, args) {
  if (!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) return;

  if(!activeChannels.includes(message.channel.id)) {
    args = args.join(' ').split(';');
    activeChannels.push(message.channel.id);

    const votes = message.channel.createCollector(
      m => m.content.startsWith(`${Bastion.config.prefix}vote `) || m.content.startsWith(`${Bastion.config.prefix}endpoll`) || m.content.startsWith(`${Bastion.config.prefix}pollend`),
      { time: 60000*60*6 }
    );
    let answers = [];
    for (var i = 1; i < args.length; i++)
    answers.push({
      name: `${i}.`,
      value: `${args[i]}`,
      inline: true
    });

    message.channel.sendMessage('', {embed: {
      color: 5088314,
      title: `A poll has been started by **${message.author.username}**.`,
      description: `**${args[0]}**`,
      fields: answers,
      footer: {
        text: `To get help with voting, type: ${Bastion.config.prefix}help vote`
      }
    }});

    votes.on('message', m => {
      if ((m.content.startsWith(`${Bastion.config.prefix}endpoll`) || m.content.startsWith(`${Bastion.config.prefix}pollend`)) && (m.author.id == message.author.id)) votes.stop();
      for (var i = 1; i < args.length; i++)
      if (m.content.startsWith(`${Bastion.config.prefix}vote ${i}`))
      m.channel.sendMessage('', {embed: {
        description: `**+1 Vote:** ${args[i]}`
      }}).then(v => {
        v.delete();
        m.delete();
      });
    });
    votes.on('end', pollRes => {
      total = pollRes.size;
      pollRes = pollRes.map(r => r.content);
      for (var i = args.length - 1; i > 0; i--)
      pollRes.unshift(`${Bastion.config.prefix}vote ${i}`);
      var count = {};
      for (var i = 0; i < pollRes.length; i++)
      count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]]+1 : 1;
      let result = [];
      for (var i = 1; i < args.length; i++) {
        result.push({
          name: args[i],
          value: `${count[Object.keys(count)[i-1]]-1}/${pollRes.length - (args.length - 1)} votes`,
          inline: true
        });
      }

      message.channel.sendMessage('', {embed: {
        color: 6651610,
        title: 'Poll Result',
        description: args[0],
        fields: result
      }}).then(
        activeChannels=activeChannels.slice(activeChannels.indexOf(message.channel.id)+1, 1)
      );
    });
  }
  else {
    message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: `Can\'t start a poll now. A poll is already running in this channel.\nWait for it to end or if you had started that previous poll, you can end that by typing \`${Bastion.config.prefix}endpoll\``
    }})
  }
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'poll',
  description: 'Starts a poll which requires users to vote using the `vote` command. Separate question & each answers with `;`',
  permission: 'Manage Messages',
  usage: ['poll Which is the game of the week?;Call of Duty©: Infinity Warfare;Tom Clancy\'s Ghost Recon© Wildlands;Watch Dogs 2']
};
