/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  let modules = [ ...new Set(Bastion.commands.map(c => c.config.module)) ];

  let fields = [];
  for (let i = 0; i < modules.length; i++) {
    let commands = Bastion.commands.filter(c => c.config.module === modules[i]).map(c => c.help.name);
    if (commands.length === 0) {
      continue;
    }

    fields.push({
      name: modules[i].replace('_', ' ').toTitleCase(),
      value: commands.join('\n'),
      inline: true
    });
  }

  await message.author.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'List of Commands',
      description: 'To get a complete list of all the commands with details click [here](https://BastionBot.org/commands).',
      fields: fields,
      footer: {
        text: `Total Modules: ${modules.length} | Total Commands: ${Bastion.commands.size}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  message.channel.send({
    embed: {
      description: `${message.author} Check your DM from me, I've sent you the list of commands.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true
};

exports.help = {
  name: 'commands',
  description: string('commands', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'commands',
  example: []
};
