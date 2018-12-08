/**
 * @file setInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }
  args = args.join(' ');

  let charLimit = 160;
  let info = await Bastion.utils.compressString(args);

  if (info.length > charLimit) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'infoRange', charLimit), message.channel);
  }

  let userModel = await Bastion.database.models.user.findOne({
    attributes: [ 'info' ],
    where: {
      userID: message.author.id
    }
  });

  if (!userModel) {
    return message.channel.send({
      embed: {
        description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your info.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  await Bastion.database.models.user.update({
    info: info
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'info' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'Info Set',
      description: args,
      footer: {
        text: args.tag
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setInfo',
  description: 'Sets your info that shows up in the Bastion user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setInfo <text>',
  example: [ 'setInfo I\'m awesome. :sunglasses:' ]
};
