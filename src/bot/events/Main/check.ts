/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Event from "../../struct/Event";
import { Message, MessageAttachment } from "discord.js";
import axios from "axios";

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message) {
    if (message.content.startsWith("```")) {
      // eslint-disable-next-line no-useless-escape
      const text = message.content.replace(/\`\`\`(\w+)?/g, "").trim();
      const buffer = await axios({
        url: "http://shizu-carbon.vercel.app/api/cook",
        method: "POST",
        data: {
          code: text,
        },
        responseType: "arraybuffer",
        headers: {
          "Content-type": "application/json",
        },
      }).catch(() => null);

      if (!buffer) {
        message.channel.send(
          `A error occurred! The website reported a malformed request`
        );
        return;
      }
      const image = new MessageAttachment(buffer.data, "image.png");
      message.channel.send({ files: [image] });
    }
  }
}

export default MessageEvent;
