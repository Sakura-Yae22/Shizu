/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction, MessageEmbed } from "discord.js";
import Interaction from "../../struct/Interaction";
import fetch from "node-fetch";

abstract class ChatInteraction extends Interaction {
  constructor() {
    super({
      name: "chat",
      description: "Chat with the bot",
      cooldown: 2,
      options: [
        {
          type: "STRING",
          name: "text",
          description: "Text to chat lmao",
          required: true,
        },
      ],
    });
  }

  public async exec(interaction: CommandInteraction, args: any[]) {
    const text: string[] = [];
    args.forEach((arg) => {
      text.push(arg.value);
    });
    fetch(
      `https://aria-api.up.railway.app/misc/chat?msg=${encodeURIComponent(
        text.join(" ")
      )}&uid=${interaction.user.id}`,
      {
        headers: {
          auth: process.env.CHAT ?? "NULL",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`${data.message}`);
        interaction.reply({
          embeds: [embed],
        });
      });
  }
}

export default ChatInteraction;
