/**
 * @file leaderboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildMemberModels = await Bastion.database.models.guildMember.findAll({
    attributes: [ 'userID', 'bastionCurrencies', 'experiencePoints', 'level' ],
    where: {
      guildID: message.guild.id
    },
    order: [
      [ Bastion.database.fn('ABS', Bastion.database.col('level')), 'DESC' ],
      [ Bastion.database.fn('ABS', Bastion.database.col('experiencePoints')), 'DESC' ],
      [ Bastion.database.fn('ABS', Bastion.database.col('bastionCurrencies')), 'DESC' ]
    ],
    limit: 10
  });

  let profiles = guildMemberModels.map(guildMember => guildMember.dataValues);

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
      value: `Level ${profiles[i].level} • ${profiles[i].experiencePoints} Experience Points`
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Leaderboard',
      description: 'These are the users topping the chart!',
      fields: fields
    }
  });
};

exports.config = {
  aliases: [ 'lb', 'hallOfFame', 'hof' ],
  enabled: true
};

exports.help = {
  name: 'leaderboard',
  description: 'Shows the users topping the chart of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [PAGE_NO]',
  example: [ 'leaderboard', 'leaderboard 3' ]
};
