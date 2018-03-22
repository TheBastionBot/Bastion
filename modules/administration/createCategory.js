/**
 * @file createCategory command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let minLength = 2, maxLength = 100;
    args.name = args.name.join(' ');
    if (args.name.length < minLength || args.name.length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'channelNameLength', true, minLength, maxLength), message.channel);
    }

    let category = await message.guild.createChannel(args.name, 'category');

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'createChannel', message.author.tag, 'category', category.name),
        footer: {
          text: `ID: ${category.id}`
        }
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'createCategory',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createCategory <Category Name>',
  example: [ 'createCategory News Feed' ]
};
