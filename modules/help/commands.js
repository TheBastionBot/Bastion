/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let modules = [ ...new Set(Bastion.commands.map(c => c.config.module)) ];
    if (args.modules) {
      args.modules = args.modules.filter(module => modules.includes(module));
      if (args.modules.length) {
        modules = args.modules;
      }
    }

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

    let authorDMChannel = await message.author.createDM();
    await authorDMChannel.send({
      embed: {
        color: Bastion.colors.GOLD,
        title: 'List of Commands',
        description: 'To get a complete list of all the commands with details, visit [my website](https://bastionbot.org/) and check out the commands section: https://bastionbot.org/.',
        fields: fields,
        footer: {
          text: `Total Modules: ${modules.length} | Total Commands: ${Bastion.commands.size}`
        }
      }
    });

    message.channel.send({
      embed: {
        description: `${message.author} Check your DM from me, I've sent you the list of commands${args.modules && args.modules.length ? ` in ${args.modules.join(', ')} modules` : ''}. You can also check out the commands section of [my website](https://bastionbot.org/) for the complete list of commands with details: https://bastionbot.org/`
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
          description: `${message.author} You need to **allow Direct Messages from your Privacy Settings** so that I'll be able to DM you with the commands.\nIf you don't prefer to change your privacy settings, you can check out the commands section of [my website](https://bastionbot.org/) for the complete list of commands with details: https://bastionbot.org/`
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
  aliases: [ 'cmds', 'modules' ],
  enabled: true,
  argsDefinitions: [
    { name: 'module', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'commands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commands [module name]',
  example: [ 'commands', 'commands game stats', 'commands moderation' ]
};
