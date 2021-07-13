/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
  CategoryChannel,
  Message,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { DiscordStatuslogs as schema } from "../../mongoose/schemas/discord-status";

abstract class setDiscordStatusCommand extends Command {
  constructor() {
    super({
      name: "set-discordStatus",
      aliases: [],
      description: "Set a channel for discord Status",
      usage: "<prefix>set-discordStatus <set-channel>",
      category: "mods",
      cooldown: 10,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["MANAGE_WEBHOOKS"],
    });
  }

  public async exec(message: Message, args: string[]) {
    // console.log(message)
    const Data = await schema.findOne({
      guildId: message.guild?.id,
    });
    if (!Data) {
      const cid =
        message.mentions.channels.first() ??
        (await message.guild?.channels.cache.get(`${BigInt(args[0])}`));
      if (!cid) {
        return message.reply(
          `Could\\'nt find a channel! Please provide a valid Id`
        );
      }
      if (cid instanceof CategoryChannel) {
        return message.reply(
          `This is not a valid channel, This is is a category tagged\nMake sure this this is a text channel`
        );
      }
      if (cid instanceof VoiceChannel) {
        return message.reply(
          `This is not a valid channel, This is is a Voice channel tagged\nMake sure this this is a text channel`
        );
      }
      if (cid instanceof StageChannel) {
        return message.reply(
          `This is not a valid channel, This is is a Stage Channel Tagged\nMake sure this this is a text channel`
        );
      }
      await new schema({
        guildId: message.guild?.id,
        channelId: cid.id,
      }).save();
      if (cid instanceof TextChannel)
        await cid.createWebhook("Shizu Discord Status", {
          avatar:
            "https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png",
          reason: "Needed a Discord Logger",
        });
      await message.reply({
        content: `Status Logs channel set to ${cid}`,
      });
    } else {
      await schema.findOneAndRemove({
        guildId: message.guild?.id,
      });
      await message.channel.send({
        content: `**Successfuly Reset the Discord Logs System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default setDiscordStatusCommand;
