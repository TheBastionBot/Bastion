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
    profiles = profiles.slice(0, 10);

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
        name: `${i + 1}. ${user}`,
        value: `Level: ${profiles[i].level}\tExperience Points: ${profiles[i].xp}\tBastion Currencies: ${profiles[i].bastionCurrencies}`
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Leaderboard',
        description: 'These are the users topping the chart!',
        fields: fields
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
    { name: 'global', type: Boolean, alias: 'g' }
  ]
};

exports.help = {
  name: 'leaderboard',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [--global]',
  example: [ 'leaderboard', 'leaderboard --global' ]
};
