/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Event from "../../struct/Event";
import { stripIndents } from "common-tags";
import {
  InteractionRegistry,
  ButtonRegistry,
} from "../../struct/registries/export/RegistryIndex";
import status from "../../struct/Discord-Status";
abstract class ReadyEvent extends Event {
  constructor() {
    super({
      name: "ready",
    });
  }

  public async exec() {
    console.log(stripIndents`Ready as ${this.client.user?.tag}
		Loaded ${this.client.commands.size} commands
		Loaded ${this.client.events.size} events
		`);
    await this.client.user.setActivity("Anime do be great");
    const cli = () => {
      this.client.cache.check(this.client);
      setTimeout(cli, 1000 * 1);
    };
    cli();

    await this.client.anischedule.init();
    InteractionRegistry(this.client);
    ButtonRegistry(this.client);
    status(this.client);
    // (await import('../../struct/Discord-Status')).default(this.client)
  }
}

export default ReadyEvent;
// async function check(guilds) {
// 	CheckMutes(guild)
// 	// setTimeout(CheckMutes, 1000 * 10)
// }
// async function ch() {
// 	setTimeout(check, 1000 * 10)

// }
