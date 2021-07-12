/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Interaction, Collection } from "discord.js";
import Event from "../../struct/Event";

abstract class InteractionEvent extends Event {
  constructor() {
    super({
      name: "interactionCreate",
    });
  }

  public async exec(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = this.client.interactions.get(interaction.commandName);
      if (command?.cooldown) {
        if (!this.client.cooldowns.has(command.name)) {
          this.client.cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps?.has(interaction.user.id)) {
          const cooldown = timestamps.get(interaction.user.id);
          if (cooldown) {
            const expirationTime = cooldown + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              interaction.reply(
                `Wait ${timeLeft.toFixed(
                  1
                )} more second(s) before reusing the \`${
                  command.name
                }\` command.`
              );
              return;
            }
          }
        }
        timestamps?.set(interaction.user.id, now);
        setTimeout(
          () => timestamps?.delete(interaction.user.id),
          cooldownAmount
        );
      }

      try {
        const arr: any[] = [];
        await interaction.options.forEach((options) => arr.push(options));
        await command?.exec(interaction, arr);
      } catch (err: any) {
        // console.log(err);
        interaction.reply(`${err.message}`);
        return;
      }
    } else if (interaction.isButton()) {
      const button = this.client.buttons.get(interaction.customId);
      if (!button) {
        // interaction.reply({
        // 	content: 'Couldnt Find the Button in Cache',
        // 	ephemeral: true
        // })
        return;
      }
      try {
        await button.exec(interaction);
      } catch (err: any) {
        interaction.reply(`${err.message}`);
        return;
      }
    }
    return;
  }
}

export default InteractionEvent;
