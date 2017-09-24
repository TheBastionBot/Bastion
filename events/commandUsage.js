/**
 * @file commandUsage event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      title: 'Invalid Use!',
      description: `See the usage below to know how to use \`${command.name}\` command.`,
      fields: [
        {
          name: 'Usage',
          value: `\`\`\`${message.guild.prefix[0]}${command.usage}\`\`\``
        },
        {
          name: 'Help',
          value: `\`\`\`${message.guild.prefix[0]}help ${command.name}\`\`\``
        }
      ]
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
