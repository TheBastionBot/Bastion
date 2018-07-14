/**
 * @file serverDescription command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let charLimit = 256;
    let serverDescription = args.length ? args.join(' ') : null;
    let messageDescription = serverDescription;
    let messageColor = Bastion.colors.RED;
    let messageTitle = 'Server Description Removed';

    if (serverDescription) {
      if (serverDescription.length > charLimit) {
        return Bastion.emit('error', '', 'Server description is limited to 256 characters.', message.channel);
      }

      serverDescription = await Bastion.methods.encodeString(serverDescription);
      messageColor = Bastion.colors.GREEN;
      messageTitle = 'Server Description Set';
    }

    await Bastion.database.models.guild.update({
      description: serverDescription
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'description' ]
    });

    message.channel.send({
      embed: {
        color: messageColor,
        title: messageTitle,
        description: messageDescription,
        footer: {
          text: message.guild.name
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'guildDescription' ],
  enabled: true
};

exports.help = {
  name: 'serverDescription',
  description: 'Set a description for the server, which will be shown in the `serverInfo` command.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'serverDescription <text>',
  example: [ 'serverDescription The official Discord server of the Bastion bot. :bastion:' ]
};
