/**
 * @file songActivities monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (oldMember, newMember) => {
  if (oldMember.user.bot || newMember.user.bot) return;
  if (newMember.user.presence.status === 'offline') return;
  // Whether the member is currently 'Listening' a song on Spotify
  if (!newMember.user.presence.game) return;
  if (newMember.user.presence.game.type !== 2 || newMember.user.presence.game.name !== 'Spotify') return;

  // Store activities in the current guild
  if (!('activities' in newMember.guild)) newMember.guild.activities = {};
  if (!('songs' in newMember.guild.activities)) newMember.guild.activities.songs = {};

  let songTitle = `${newMember.user.presence.game.details} by ${newMember.user.presence.game.state}`;

  if (!(songTitle in newMember.guild.activities.songs)) newMember.guild.activities.songs[songTitle] = [];

  if (newMember.guild.activities.songs[songTitle].includes(newMember.id)) return;

  newMember.guild.activities.songs[songTitle].push(newMember.id);
};
