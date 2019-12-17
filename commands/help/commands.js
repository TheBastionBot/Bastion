/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let categories = Bastion.commands.map(c => c.config.module.toLowerCase()).unique();

  if (!args.category) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.GOLD,
        title: 'List of Command Categories',
        description: `Use the \`${this.help.name} <category>\` command to list all the commands in the specified category.\nTo get a complete list of all the commands with details, visit [my website](https://bastion.traction.one/) and check out the commands section: https://bastion.traction.one/commands.`,
        fields: [
          {
            name: 'Command Categories',
            value: categories.map(m => m.replace(/_/g, ' ').toTitleCase()).join('\n')
          }
        ],
        footer: {
          text: `Did you know? There are ${Bastion.commands.size} commands in this version of Bastion!`
        }
      }
    });
  }

  args.category = args.category.join('_').toLowerCase();
  if (!categories.includes(args.category)) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Command Cateogry Not Found',
        description: 'Use the `commands` command without any arguments to get a list of all the available command categories.'
      }
    });
  }

  let commands = Bastion.commands.filter(c => c.config.module === args.category);
  args.category = args.category.replace(/_/g, ' ').toTitleCase();

  await message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: `List of Commands in ${args.category} category`,
      description: `Use the \`commands\` command to get a list of all the ${categories.length} command categories.`,
      fields: [
        {
          name: `${commands.size} ${args.category} Commands`,
          value: `\`\`\`css\n${commands.map(c => c.help.name).join('\n')}\`\`\``
        },
        {
          name: 'Need more details?',
          value: 'Check out the help message of the command, using the `help <command>` command.'
        },
        {
          name: 'Want the complete list?',
          value: 'To get a complete list of all the commands with details, visit [my website](https://bastion.traction.one/) and check out the commands page: https://bastion.traction.one/commands.'
        }
      ],
      footer: {
        text: `Did you know? There are ${Bastion.commands.size} commands in this version of Bastion!`
      }
    }
  });
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true,
  argsDefinitions: [
    { name: 'category', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'commands',
  description: 'Shows the list of command categories. And if a category is specified, Bastion will show a list of commands in that category.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commands [category]',
  example: [ 'commands', 'commands game stats', 'commands moderation' ]
};
