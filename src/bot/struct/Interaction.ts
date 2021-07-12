import { ApplicationCommandOptionData, Interaction } from 'discord.js';
import Bot from '../client/Client';
import { InteractionType } from '../types/Options';

abstract class InteractionCommand {
		public name: string;
		public description: string;
		public cooldown: number;
		public options: ApplicationCommandOptionData[] | undefined;
		public abstract client: Bot;

		constructor(options: InteractionType) {
				this.name = options.name;
				this.description = options.description ?? '';
				this.cooldown = options.cooldown ?? 0;
				this.options = options.options;
		}

		public abstract exec(interactions: Interaction, args: (string | number | boolean | undefined)[]): void | Promise<void>;
}

export default InteractionCommand;
