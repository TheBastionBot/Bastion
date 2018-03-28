/**
 * @file pollStats command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.channel.poll && message.channel.poll.collector) {
    let pollRes = message.channel.poll.collector.collected;
    let pollMessage = message.channel.poll.message;

    pollRes = pollRes.map(r => r.content);
    pollRes = pollRes.filter(res => parseInt(res) && parseInt(res) > 0 && parseInt(res) < pollMessage.length);
    if (pollRes.length === 0) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          title: 'Poll Status',
          description: 'No votes have been given yet. You can vote by sending the corresponding number of the option.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    for (let i = pollMessage.length - 1; i > 0; i--) {
      pollRes.unshift(i);
    }
    let count = {};
    for (let i = 0; i < pollRes.length; i++) {
      count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]] + 1 : 1;
    }
    let result = [];
    let totalVotes = (pollRes.length - (pollMessage.length - 1));
    for (let i = 1; i < pollMessage.length; i++) {
      let numOfVotes = count[Object.keys(count)[i - 1]] - 1;
      result.push({
        name: pollMessage[i],
        value: `${(numOfVotes / totalVotes) * 100}% (${numOfVotes} of ${totalVotes})`,
        inline: true
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Poll Status',
        description: `Poll results for **${pollMessage[0]}**`,
        fields: result
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'pollStats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pollStats',
  example: []
};
