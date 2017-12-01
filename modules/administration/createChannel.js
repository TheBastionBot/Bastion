/**
 * @file createChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let minLength = 2, maxLength = 100;
  args.name = args.name.join('-');
  if (args.name.length < minLength || args.name.length > maxLength) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'channelNameLength', true, minLength, maxLength), message.channel);
  }

  let channelType = 'text';
  if (!args.text && args.voice) {
    channelType = 'voice';
  }
  else {
    args.name = args.name.replace(' ', '-');
  }

  try {
    let channel = await message.guild.createChannel(args.name, 'channelType');

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: `${channelType.charAt(0).toUpperCase() + channelType.substr(1)} Channel Created`,
        fields: [
          {
            name: 'Channel Name',
            value: channel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: channel.id,
            inline: true
          }
        ]
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'createc' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', multiple: true, defaultOption: true },
    { name: 'text', type: Boolean, alias: 't' },
    { name: 'voice', type: Boolean, alias: 'v' }
  ]
};

exports.help = {
  name: 'createChannel',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createChannel [-t | -v] <Channel Name>',
  example: [ 'createChannel -t Text Channel Name', 'createChannel -v Voice Channel Name', 'createChannel Text Channel Name' ]
};
