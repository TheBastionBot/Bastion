/**
 * @file musicMasterRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      await Bastion.db.run(`UPDATE guildSettings SET musicMasterRole=null WHERE guildID=${message.guild.id}`);

      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: Bastion.strings.info(message.guild.language, 'removeMusicMasterRole', message.author.tag)
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    let role = message.guild.roles.get(args[0]);
    if (!role) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    await Bastion.db.run(`UPDATE guildSettings SET musicMasterRole=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'addMusicMasterRole', message.author.tag, role.name)
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
  aliases: [ 'musicmaster' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'musicMasterRole',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'musicMasterRole [ROLE_ID]',
  example: [ 'musicMasterRole 319225727067095043', 'musicMasterRole' ]
};
