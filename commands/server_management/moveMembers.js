/**
 * @file moveMembers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.from) {
    return Bastion.emit('commandUsage', message, this.help);
  }


  let voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
  let sourceVoiceChannel = voiceChannels.get(args.from);
  let destinationVoiceChannel = voiceChannels.get(args.to);

  if (!sourceVoiceChannel || (args.to && !destinationVoiceChannel)) {
    return Bastion.emit('error', '', 'Invalid voice channel(s). Please recheck the IDs of the Voice Channels.', message.channel);
  }

  if (!sourceVoiceChannel.permissionsFor(message.member).has('MOVE_MEMBERS')) return;
  if (args.to && !destinationVoiceChannel.permissionsFor(message.member).has('MOVE_MEMBERS')) return;


  let sourceVoiceChannelMembers = sourceVoiceChannel.members.array();
  for (let member of sourceVoiceChannelMembers) {
    await member.setVoiceChannel(destinationVoiceChannel).catch((e) => Bastion.log.error(e));
  }


  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: args.to
        ? `${message.author.tag} moved all the members from **${sourceVoiceChannel.name}** Voice Channel to **${destinationVoiceChannel.name}** Voice Channel.`
        : `${message.author.tag} kicked all the members from the **${sourceVoiceChannel.name}** Voice Channel.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'mvMem' ],
  enabled: true,
  argsDefinitions: [
    { name: 'from', type: String },
    { name: 'to', type: String, defaultValue: null }
  ]
};

exports.help = {
  name: 'moveMembers',
  description: 'Moves all the members in a voice channel to another specified voice channel. If the destination voice channel is not specified, Bastion will instead kick all the members from the source voice channel.',
  botPermission: 'MOVE_MEMBERS',
  userTextPermission: '',
  userVoicePermission: 'MOVE_MEMBERS',
  usage: 'moveMembers ',
  example: [ 'movemembers --from 199281703245316119 --to 167028141619413002', 'movemembers --from 199281703245316119' ]
};
