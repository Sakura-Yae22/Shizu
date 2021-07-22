/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { guild as schema } from "../../mongoose/schemas/guild";
import Command from "../../struct/Command";
import { Message, Channel, TextChannel } from "discord.js";

abstract class SuggestChannelCommand extends Command {
  constructor() {
    super({
      name: "set-suggest",
      aliases: [],
      description: "Set a suggestion channel",
      usage: "<prefix>suggest <channel>",
      category: "mods",
      cooldown: 120,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: [
        "ADD_REACTIONS",
        "USE_EXTERNAL_EMOJIS",
        "MANAGE_MESSAGES",
      ],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]) {
    const Data = await schema.findOne({
      guildId: message.guild?.id,
      suggestChannelId: { $exists: true },
    });
    if (!Data) {
      const cid: Channel | undefined =
        message.mentions.channels.first() ||
        message.guild?.channels.cache.get(`${BigInt(args[0])}`);
      if (!cid || !(cid instanceof TextChannel))
        return message.reply({
          content: `Could\\'nt find a vaild text channel! Please provide a valid Id`,
        });
      await schema.findOneAndUpdate(
        {
          guildId: message.guild?.id,
        },
        {
          $set: {
            suggestChannelId: cid.id,
          },
        }
      );
      this.client.cache.suggestcache.set(`${message.guild?.id}`, cid.id);
      message.reply({
        content: `Suggestions channel set to ${cid}\nTo approve/deny suggestions, please use the slash command \`suggest\` with one of the following options \`accept\` \`deny\``,
      });
      cid.send({
        embeds: [
          {
            description:
              "Suggestion channel is now to the current channel\nTo suggest suggestions, please use the slash command or directly type in this channel",
          },
        ],
      });
    } else {
      await schema.findOneAndUpdate(
        {
          guildId: message.guild?.id,
        },
        {
          $unset: {
            suggestChannelId: "",
          },
        }
      );
      this.client.cache.suggestcache.delete(`${message.guild?.id}`);
      message.channel.send({
        content: `**Successfuly Reset the Suggestion System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default SuggestChannelCommand;
