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

  public async exec(message: Message, args: string[]) {
    const data = this.client.cache.getData(message.guild?.id);
    if (data && !data.suggestChannelId) {
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
      data.suggestChannelId = cid.id;
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
    } else if (data && data.suggestChannelId) {
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
      data.suggestChannelId = null;
      message.channel.send({
        content: `**Successfuly Reset the Suggestion System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default SuggestChannelCommand;
