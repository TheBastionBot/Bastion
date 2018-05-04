/**
 * @file commandUsage event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      description: message.client.i18n.error(message.guild.language, 'commandUsage', command.name),
      fields: [
        {
          name: 'Usage',
          value: `\`\`\`${message.guild.prefix[0]}${command.usage}\`\`\``
        },
        {
          name: 'Get Help',
          value: `\`\`\`${message.guild.prefix[0]}help ${command.name}\`\`\``
        }
      ]
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
