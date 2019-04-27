/**
 * @file karmaBoard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildMemberModels = await Bastion.database.models.guildMember.findAll({
    attributes: [ 'userID', 'karma' ],
    where: {
      guildID: message.guild.id
    },
    order: [
      [ Bastion.database.fn('ABS', Bastion.database.col('karma')), 'DESC' ]
    ],
    limit: 10
  });

  let profiles = guildMemberModels.map(guildMember => guildMember.dataValues).filter(profile => profile.karma !== '0');

  let fields = [];

  for (let i = 0; i < profiles.length; i++) {
    let user;
    if (message.guild.members.has(profiles[i].userID)) {
      let member = await message.guild.members.get(profiles[i].userID);
      user = member.displayName === member.user.username ? `${member.displayName} / ${member.id}` : `${member.displayName} / ${member.user.tag} / ${member.id}`;
    }
    else {
      user = profiles[i].userID;
    }
    fields.push({
      name: `${i + 1}. ${user}`,
      value: `${profiles[i].karma} Karma`
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Karma Board',
      description: 'These are the users with the highest karma!',
      fields: fields
    }
  });
};

exports.config = {
  aliases: [ 'kb', 'karmaLeaderBoard', 'karmaLB' ],
  enabled: true
};

exports.help = {
  name: 'karmaBoard',
  description: 'Shows the users with the highest karma in the server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'karmaBoard [PAGE_NO]',
  example: [ 'karmaBoard', 'karmaBoard 3' ]
};
