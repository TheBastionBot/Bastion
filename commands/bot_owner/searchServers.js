/**
 * @file searchServers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let guilds = Bastion.guilds.filter(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())).map(g => `${g.name} - ${g.id}`);
  let total = guilds.length;
  guilds = total > 0 ? guilds.slice(0, 10).join('\n') : 'None';

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Server search',
      description: `Found **${total}** servers${Bastion.shard ? `, in Shard ${Bastion.shard.id},` : ''} with **${args.join(' ')}** in it's name.`,
      fields: [
        {
          name: 'Servers',
          value: total > 10 ? `and ${total - 10} more.` : guilds
        }
      ]
    }
  });
};

exports.config = {
  aliases: [ 'searchGuilds' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'searchServers',
  description: 'Searches for Discord servers, containing the specified text in their name, that Bastion is connected to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'searchServers <name>',
  example: [ 'searchServers Bastion' ]
};
