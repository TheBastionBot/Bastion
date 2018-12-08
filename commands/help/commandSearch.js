/**
 * @file commandSearch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length || args.join('').length < 2) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.join('').toLowerCase();
  let commands = Bastion.commands.map(c => c.help.name.toLowerCase()).filter(c => c.includes(args));
  if (commands.length === 0) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Command Search',
      description: `Found ${commands.length} commands containing *${args}*.`,
      fields: [
        {
          name: 'Commands',
          value: `${message.guild.prefix[0]}${commands.join(`\n${message.guild.prefix[0]}`)}`
        }
      ]
    }
  });
};

exports.config = {
  aliases: [ 'cmdsearch' ],
  enabled: true
};

exports.help = {
  name: 'commandSearch',
  description: 'Search for a command with the given text.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandSearch <keyword>',
  example: [ 'commandSearch user' ]
};
