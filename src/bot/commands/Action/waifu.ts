/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

abstract class SmugCommand extends Command {
  constructor() {
    super({
      name: "waifu",
      aliases: [],
      description:
        "Waifu's : ) [NSFW should be reported immediately and the command should be be disabled]",
      usage: "<prefix>waifu",
      category: "Action",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: false,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }
  public async exec(message: Message) {
    const {
      data: { url },
    } = await axios.get(`https://waifu.pics/api/sfw/waifu`);
    const embed = new MessageEmbed().setImage(`${url}`).setColor(`#FFC0CB`);
    message.reply({ embeds: [embed] });
  }
}
export default SmugCommand;
