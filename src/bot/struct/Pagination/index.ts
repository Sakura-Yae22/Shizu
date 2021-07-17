import { DMChannel, Message, MessageEmbed, TextChannel } from "discord.js";
import { ButtonOption } from "./types/ButtonOption";

//const availableEmojis = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"];
const availableEmojis = [
  "<:left:865603838290690058>",
  "<:pause:865604031849562132>",
  "<:right:865603935234293770>",
  "<:delete:865604123574927370>",
];

class Pagination {
  private message?: Message;
  private readonly channel: TextChannel | DMChannel;
  private readonly pages: MessageEmbed[];
  private index = 0;
  timeout: number | undefined;
  rmsg: Message;

  constructor(
    message: Message,
    channel: TextChannel | DMChannel,
    pages: MessageEmbed[],
    footerText = "Page",
    timeout?: number,
    options?: ButtonOption[]
  ) {
    this.timeout = timeout;
    this.rmsg = message;
    if (options && options.length > 5) {
      throw new TypeError("You have passed more than 5 buttons as options");
    } else if (options && options.length < 4) {
      throw new TypeError("You have passed less than 5 buttons as options");
    }
    this.channel = channel;
    this.pages = pages.map((page, pageIndex) => {
      if (page.footer && (page.footer.text || page.footer.iconURL)) return page;
      return page.setFooter(
        `${footerText} ${pageIndex + 1} of ${pages.length}`
      );
    });
  }

  /**
   * Starts the pagination
   */
  async paginate(): Promise<void> {
    this.message = await this.channel.send({
      embeds: [this.pages[this.index]],
      components: [
        {
          type: 1,
          components: [
            {
              type: "BUTTON",
              style: "PRIMARY",
              //label: "Next",
              emoji: "<:left:865603838290690058>",
              customId: "<:left:865603838290690058>",
            },
            {
              type: "BUTTON",
              style: "DANGER",
              // label: "Stop",
              emoji: "<:pause:865604031849562132>",
              customId: "<:pause:865604031849562132>",
            },
            {
              type: "BUTTON",
              style: "PRIMARY",
              emoji: "<:right:865603935234293770>",
              customId: "<:right:865603935234293770>",
            },
            {
              type: "BUTTON",
              style: "PRIMARY",
              emoji: "<:delete:865604123574927370>",
              customId: "<:delete:865604123574927370>",
            },
          ],
        },
      ],
    });
    if (this.pages.length < 2) {
      return;
    }
    const filter = (interaction) => interaction.user.id === this.rmsg.author.id;
    const interactionCollector = this.message.createMessageComponentCollector({
      filter,
      idle: 1000 * 60,
      dispose: false,
    });

    interactionCollector.on("collect", async (interaction) => {
      const { customId } = interaction;
      switch (customId) {
        case availableEmojis[0]:
          // Prev
          this.index--;
          if (this.index <= 0) this.index = this.pages.length - 1;
          await interaction.update({
            embeds: [this.pages[this.index]],
          });
          break;
        case availableEmojis[1]:
          // Stop
          interactionCollector.stop("stopped by user");
          await interaction.update({
            components: [
              {
                type: 1,
                components: [
                  {
                    type: "BUTTON",
                    style: "PRIMARY",
                    disabled: true,
                    //label: "Next",
                    emoji: "<:left:865603838290690058>",
                    customId: "<:left:865603838290690058>",
                  },
                  {
                    type: "BUTTON",
                    style: "DANGER",
                    disabled: true,
                    // label: "Stop",
                    emoji: "<:pause:865604031849562132>",
                    customId: "<:pause:865604031849562132>",
                  },
                  {
                    type: "BUTTON",
                    style: "PRIMARY",
                    disabled: true,
                    emoji: "<:right:865603935234293770>",
                    customId: "<:right:865603935234293770>",
                  },
                  {
                    type: "BUTTON",
                    style: "PRIMARY",
                    disabled: true,
                    emoji: "<:delete:865604123574927370>",
                    customId: "<:delete:865604123574927370>",
                  },
                ],
              },
            ],
          });
          break;
        case availableEmojis[2]:
          // Next
          this.index++;
          if (this.index >= this.pages.length) {
            this.index = 0;
          }
          await interaction.update({
            embeds: [this.pages[this.index]],
          });
          break;
        case availableEmojis[3]:
          this.message?.edit({
            embeds: [],
            content: `Deleted the embed from continuing further\nCommand used \`${this.rmsg.content}\` by ${this.rmsg.author}`,
            components: [],
          });
          break;
      }
    });
    interactionCollector.on("end", async () => {
      await this?.message?.edit({
        components: [
          {
            type: 1,
            components: [
              {
                type: "BUTTON",
                style: "PRIMARY",
                disabled: true,
                //label: "Next",
                emoji: "<:left:865603838290690058>",
                customId: "<:left:865603838290690058>",
              },
              {
                type: "BUTTON",
                style: "DANGER",
                disabled: true,
                // label: "Stop",
                emoji: "<:pause:865604031849562132>",
                customId: "<:pause:865604031849562132>",
              },
              {
                type: "BUTTON",
                style: "PRIMARY",
                disabled: true,
                emoji: "<:right:865603935234293770>",
                customId: "<:right:865603935234293770>",
              },
              {
                type: "BUTTON",
                style: "PRIMARY",
                disabled: true,
                emoji: "<:delete:865604123574927370>",
                customId: "<:delete:865604123574927370>",
              },
            ],
          },
        ],
      });
    });
  }
}

export { ButtonOption, Pagination };
