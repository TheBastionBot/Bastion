/**
 * @file listWarns command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildMemberModel = await message.client.database.models.guildMember.findAll({
      attributes: [ 'userID', 'warnings' ],
      where: {
        guildID: message.guild.id,
        warnings: {
          [Bastion.database.Op.not]: null
        }
      }
    });

    let warnedMembers = guildMemberModel.map(model => model.dataValues);


    if (warnedMembers.length === 0) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: 'No one has been warned yet.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }


    let membersList = [];
    for (let member of warnedMembers) {
      if (message.guild.members.has(member.userID)) {
        membersList.push(`${message.guild.members.get(member.userID).user.tag} - ${member.warnings.length} Warnings`);
      }
      else {
        membersList.push(`${member.userID} - ${member.warnings.length} Warnings`);
      }
    }


    message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        title: 'Warning List',
        description: membersList.join('\n')
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
  aliases: [ 'warns' ],
  enabled: true
};

exports.help = {
  name: 'listWarns',
  description: 'Lists all the warned users of your Discord Server.',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'listWarns',
  example: []
};
