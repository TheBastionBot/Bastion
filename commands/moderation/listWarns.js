/**
 * @file listWarns command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
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
    return await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'No one has been warned yet.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  let noOfPages = warnedMembers.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  let membersList = [];
  for (let member of warnedMembers) {
    if (message.guild.members.has(member.userID)) {
      membersList.push(`${message.guild.members.get(member.userID).user.tag} - ${member.warnings.length} Warnings`);
    }
    else {
      membersList.push(`${member.userID} - ${member.warnings.length} Warnings`);
    }
  }


  await message.channel.send({
    embed: {
      color: Bastion.colors.ORANGE,
      title: 'Warning List',
      description: membersList.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'warns' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listWarns',
  description: 'Lists all the warned users of your Discord Server.',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'listWarns [PAGE_NO]',
  example: [ 'listWarns', 'listWarns 3' ]
};
