/**
 * @file farewellMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.text && !args.embed) {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'farewell', 'farewellMessage' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (guildModel.dataValues.farewellMessage && Object.keys(guildModel.dataValues.farewellMessage).length) {
      let text = guildModel.dataValues.farewellMessage.text ? guildModel.dataValues.farewellMessage.text : null;
      delete guildModel.dataValues.farewellMessage.text;

      let embed = Object.keys(guildModel.dataValues.farewellMessage).length ? guildModel.dataValues.farewellMessage : null;
      if (embed) {
        embed.footer = {};
        embed.footer.text = guildModel.dataValues.farewell ? 'Farewell Message Preview' : 'Farewells are currently disabled. You can enable it using the `farewell` command.';
      }

      if (text && embed) {
        await message.channel.send(text, { embed: embed });
      }
      else if (text) {
        await message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            description: text,
            footer: {
              text: guildModel.dataValues.farewell ? 'Farewell Message Preview' : 'Farewells are currently disabled. You can enable it using the `farewell` command.'
            }
          }
        });
      }
      else if (embed) {
        await message.channel.send({ embed: embed });
      }
    }
    else {
      await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Farewell Message',
          description: `Not set. See the help message for this command to see how to set a farewell message to farewell users leaving the server: \`help ${this.help.name}\``
        }
      });
    }
  }
  else {
    let responseObject = {};

    if (args.text) {
      responseObject.text = args.text.join(' ');
    }
    if (args.embed) {
      args.embed = args.embed.join(' ');
      Object.assign(responseObject, JSON.parse(args.embed));

      delete responseObject.footer;
    }

    await Bastion.database.models.guild.update({
      farewellMessage: responseObject
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewellMessage' ]
    });

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Farewell Message',
        description: `Successfully set the farewell message. Use the \`${this.help.name}\` command without any arguments to see a preview of the farewell message.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'fmsg' ],
  enabled: true,
  argsDefinitions: [
    { name: 'text', type: String, alias: 't', multiple: true, defaultOption: true },
    { name: 'embed', type: String, alias: 'e', multiple: true }
  ]
};

exports.help = {
  name: 'farewellMessage',
  description: 'Edits the farewell message that shows when a member leaves the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewellMessage [MESSAGE] [--embed EMBED_OBJECT]',
  example: [ 'farewellMessage', 'farewellMessage Bye {author}! Hope to see you soon!', 'farewellMessage Bye {author}! --embed { "title": "{author}", "description": "Hope to see you soon." }' ]
};
