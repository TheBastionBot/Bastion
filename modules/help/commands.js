/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let modules = [ ...new Set(Bastion.commands.map(c => c.config.module)) ];
    if (args.module) {
      args.module = args.module.join('_').toLowerCase();
      if (modules.includes(args.module)) {
        await message.channel.send({
          embed: {
            color: Bastion.colors.GOLD,
            title: `List of Commands in ${args.module.replace(/_/g, ' ').toTitleCase()} Module`,
            description: `To get the list of all the commands with details click [here](https://bastionbot.org/commands).\n\`\`\`css\n${Bastion.commands.filter(cmd => cmd.config.module === args.module).map(cmd => cmd.help.name).join('\n')}\`\`\``
          }
        });
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'module'), message.channel);
      }
    }
    else {
      await message.channel.send({
        embed: {
          color: Bastion.colors.GOLD,
          title: 'List of Bastion Modules',
          description: `To get a list of commands in a module, use the module name with the \`commands\` command, example: \`${message.guild.prefix[0]}commands game stats\`.` +
                       `\n\`\`\`${modules.join('\n').replace(/_/g, ' ').toTitleCase()}\`\`\``
        }
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'cmds' ],
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
