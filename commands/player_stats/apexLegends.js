/**
 * @file apexLegends command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.player) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let stats = await Bastion.methods.makeBWAPIRequest(`/gamestats/apexlegends/${args.platform = 5}/${args.player}`);
  stats = stats.data;

  let fields = stats.stats.map(stat => ({
    name: stat.metadata.name,
    value: stat.displayValue,
    inline: true
  }));

  let legends = stats.children.filter(child => child.id.startsWith('legend')).
    map(child => child.metadata.legend_name);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: stats.metadata.platformUserHandle
      },
      title: 'Apex Legends - Player Stats',
      description: `${stats.metadata.platformUserHandle} has played with ${legends.join(', ')}`,
      fields,
      thumbnail: {
        url: 'https://pbs.twimg.com/profile_images/1092213870649794560/E0beUB_u_400x400.jpg'
      },
      footer: {
        text: 'Powered by Tracker Network'
      }
    }
  });
};

exports.config = {
  aliases: [ 'apex' ],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, defaultOption: true },
    { name: 'platform', type: Number, alias: 'p', defaultValue: 5 }
  ]
};

exports.help = {
  name: 'apexLegends',
  description: 'Get stats of any Apex Legends player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'apexLegends <PLAYER_NAME>',
  example: [ 'apexLegends k3rn31p4nic' ]
};
