/**
 * @file leaderboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let guildMemberModels = await Bastion.database.models.guildMember.findAll({
      attributes: [ 'userID', 'bastionCurrencies', 'experiencePoints', 'level' ],
      where: {
        guildID: message.guild.id
      },
      order: [
        [ Bastion.database.fn('ABS', Bastion.database.col('level')), 'DESC' ],
        [ Bastion.database.fn('ABS', Bastion.database.col('experiencePoints')), 'DESC' ],
        [ Bastion.database.fn('ABS', Bastion.database.col('bastionCurrencies')), 'DESC' ]
      ]
    });
    let profiles = guildMemberModels.map(guildMember => guildMember.dataValues);

    let fields = [];

    let noOfPages = profiles.length / 10;
    let p = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    p = p - 1;
    profiles = profiles.slice(p * 10, (p * 10) + 10);

    for (let i = 0; i < profiles.length; i++) {
      let user;
      if (message.guild.members.has(profiles[i].userID)) {
        let member = await message.guild.fetchMember(profiles[i].userID);
        user = `${member.user.tag} - ${member.id}`;
      }
      else {
        user = profiles[i].userID;
      }
      fields.push({
        name: `${i + 1 + (p * 10)}. ${user}`,
        value: `Level: ${profiles[i].level}\tExperience Points: ${profiles[i].experiencePoints}\tBastion Currencies: ${profiles[i].bastionCurrencies}`
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Leaderboard',
        description: 'These are the users topping the chart!',
        fields: fields,
        footer: {
          text: `Page: ${p + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
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
  aliases: [ 'lb', 'hallOfFame', 'hof' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
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
