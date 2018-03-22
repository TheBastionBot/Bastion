/**
 * @file leaderboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let profiles = await Bastion.db.all('SELECT userID, level, xp, bastionCurrencies FROM profiles ORDER BY level * 1 DESC, xp * 1 DESC, bastionCurrencies * 1 DESC');

    let fields = [];

    if (!args.global) {
      profiles = profiles.filter(p => message.guild.members.get(p.userID));
    }

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
        value: `Level: ${profiles[i].level}\tExperience Points: ${profiles[i].xp}\tBastion Currencies: ${profiles[i].bastionCurrencies}`
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
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 },
    { name: 'global', type: Boolean, alias: 'g' }
  ]
};

exports.help = {
  name: 'leaderboard',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [PAGE_NO] [--global]',
  example: [ 'leaderboard', 'leaderboard 3', 'leaderboard --global', 'leaderboard 2 --global' ]
};
