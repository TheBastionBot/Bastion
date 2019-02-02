const sendHeartbeat = require('./modules/sendHeartbeat');
const guildCount = require('./modules/guildCount');

module.exports = async (Bastion) => {
  try {
    await sendHeartbeat(Bastion);
    await guildCount(Bastion);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};
