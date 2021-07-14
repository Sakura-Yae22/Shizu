/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Bot from "../client/Client";
import { Guild, TextChannel, User, Webhook } from "discord.js";
import { modlogs as schema } from "../mongoose/schemas/modlogs";

async function log(guild: Guild | any, client: Bot): Promise<void | Webhook> {
  const data = client.cache.getModChannel(guild.id);
  if (!data) return;
  const channel = (await guild.channels.cache.get(data)) as TextChannel;
  const arr: Webhook[] | any[] = [];
  let check = false;
  if (!channel.permissionsFor(guild?.me!).has("MANAGE_WEBHOOKS")) {
    await schema.findOneAndRemove({
      guildId: guild.id,
    });
    const owner = await guild.fetchOwner();
    await owner.user
      .send({
        content: `I wasnt able to get a webhook from the channel with the id ${data} for the mod Logs\nI have **reset** the Mod Logs\nI dont have Perms for manage webhooks, pls make sure I have that permission`,
      })
      .catch(() => {
        return;
      });
    return;
  }
  const webhook = await channel.fetchWebhooks();
  webhook.forEach(async (webhook: Webhook) => {
    if (webhook.owner instanceof User && webhook.owner.id === client.user.id)
      arr.push(webhook);
    else return;
  });
  if (!arr[0]) {
    if (webhook.size !== 10) {
      const web = await channel
        .createWebhook("Shizu Logger", {
          avatar: `${client.user.displayAvatarURL()}`,
          reason: `Mod Logs`,
        })
        .catch(async () => {
          check = true;
          await schema.findOneAndRemove({
            guildId: guild.id,
          });
          const owner = await guild.fetchOwner();
          await owner.user
            .send({
              content: `I wasnt able to get a webhook from the channel with the id ${data} for the mod logs\nI have **reset** the Mod Logs`,
            })
            .catch(() => {
              return;
            });
          return;
        });
      if (check) return;
      arr[0] = web;
    } else {
      const logger = webhook.first();
      arr[0] = logger;
    }
  }
  return arr[0];
}

export { log };
