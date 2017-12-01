/**
 * @file reputation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let recentUsers = [];
const COOLDOWN = 12;

exports.exec = async (Bastion, message) => {
  if (!recentUsers.includes(message.author.id)) {
    let user = message.mentions.users.first();
    if (!user) return;
    if (user.id === message.author.id) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), 'You can\'t give reputation to yourself!', message.channel);
    }

    try {
      let profile = await Bastion.db.get(`SELECT reputation FROM profiles WHERE userID=${user.id}`);
      if (!profile) {
        await Bastion.db.run('INSERT INTO profiles (userID, reputation) VALUES (?, ?)', [ user.id, 1 ]);
      }
      else {
        await Bastion.db.run(`UPDATE profiles SET reputation=${parseInt(profile.reputation) + 1} WHERE userID=${user.id}`);
      }

      recentUsers.push(message.author.id);
      setTimeout(() => {
        recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
      }, COOLDOWN * 60 * 60 * 1000);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `You have given one reputation to ${user.tag}`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'cooldown'), `You have recently given reputation to someone, please wait at least ${COOLDOWN} hours before giving reputation again.`, message.channel);
  }
};

exports.config = {
  aliases: [ 'rep' ],
  enabled: true
};

exports.help = {
  name: 'reputation',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reputation <@USER_MENTION>',
  example: [ 'reputation @k3rn31p4nic#8383' ]
};
