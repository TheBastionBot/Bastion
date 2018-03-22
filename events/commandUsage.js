/**
 * @file commandUsage event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      title: message.client.strings.error(message.guild.language, 'invalidUse'),
      description: message.client.strings.error(message.guild.language, 'commandUsage', true, command.name),
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
