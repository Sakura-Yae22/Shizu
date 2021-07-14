/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import {
  CategoryChannel,
  Message,
  MessageActionRow,
  MessageButton,
  StageChannel,
  VoiceChannel,
} from "discord.js";
import { watchList } from "../../mongoose/schemas/GuildWatchList";

abstract class AnischedCommand extends Command {
  constructor() {
    super({
      name: "anischedule",
      aliases: ["anisched"],
      description: "Set the channel for anischedule",
      usage: "<prefix>anisched <set-channel>",
      category: "mods",
      cooldown: 50,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: [],
    });
  }

  public async exec(message: Message, args: string[]) {
    const document = await watchList.findById(String(message.guild?.id));
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setLabel(`Report this here`)
        .setStyle("LINK")
        .setURL(`https://discord.gg/b7HzMtSYtX`),
    ]);
    if (document instanceof Error)
      return message.channel.send({
        content: `A error has occurred! Pls report this to the devs`,
        components: [row],
      });

    if (!document) {
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
      await new watchList({
        _id: String(message.guild?.id),
        channelId: cid.id,
      }).save();
      message.reply({
        content: `Anischedule channel set to ${cid}`,
      });
    } else if (document) {
      await watchList.findByIdAndRemove(message.guild?.id);
      return message.reply({
        content: `**Successfuly Reset the Anischedule System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default AnischedCommand;
