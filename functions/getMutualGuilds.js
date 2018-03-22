module.exports = async (user) => {
  // Gets the no. of guilds `user` share with Bastion per shard.
  let mutualGuilds = await user.client.shard.broadcastEval(`let ids = Array.from(this.guilds.keys()), count = 0; for (let id of ids) if (this.guilds.get(id).members.has('${user.id}')) ++count; count;`);
  return mutualGuilds.reduce((sum, val) => sum + val, 0);
};
