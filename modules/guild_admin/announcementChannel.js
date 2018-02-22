/**
 * @file announcementChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let description, color;

    if (args.remove) {
      await Bastion.db.run(`UPDATE guildSettings SET announcementChannel=null WHERE guildID=${message.guild.id}`);
      description = 'The announcement channel has been removed.';
      color = Bastion.colors.RED;
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET announcementChannel='${message.channel.id}' WHERE guildID=${message.guild.id}`);
      description = 'This channel has been set as the announcement channel for Bastion.';
      color = Bastion.colors.GREEN;
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'announcementChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'announcementChannel [--remove]',
  example: [ 'announcementChannel', 'announcementChannel --remove' ]
};
