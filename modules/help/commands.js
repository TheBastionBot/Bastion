/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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

  try {
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
    });

    message.channel.send({
      embed: {
        description: `${message.author} Check your DM from me, I've sent you the list of commands.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 50007) {
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `${message.author} You need to allow Direct Message from your Privacy Settings so that I'll be able to DM you with the commands. If you still don't prefer to change your settings, you can view the commands in https://bastionbot.org/commands`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true
};

exports.help = {
  name: 'commands',
  botPermission: '',
  userPermission: '',
  usage: 'commands',
  example: []
};
