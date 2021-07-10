/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
// import { ApplicationCommandData } from 'discord.js';
import { sync } from 'glob';
import { resolve } from 'path';
import Bot from '../../client/Client';
import Interaction from '../Interaction';
// sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
// sudo mkswap /swapfile
//  sudo swapon /swapfile
// tslint:disable-next-line: ban-types
const registerInteraction: Function = (client: Bot) => {
	const interactionFiles = sync(resolve('dist/bot/interactions/**/*'));
	interactionFiles.forEach(async (file) => {
		if (/\.(j|t)s$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Interaction) {
				const interaction: Interaction = new File;
				interaction.client = client;
				client.interactions.set(interaction.name, interaction);
				// const data: ApplicationCommandData = {
				// 	name: interaction.name,
				// 	description: interaction.description ?? 'Empty description',
				// 	options: interaction.options ?? []
				// };
				// await client.guilds.cache.get('851088432859447347')?.commands.create(data)
				//await client.guilds.cache.get('823797050801913886')?.commands.create(data);
				//await client.guilds.cache.get('851088432859447347')?.commands.create(data);
				//await client.guilds.cache.get('789800070895763476')?.commands.create(data); // Guild commands
				// await client.guilds.cache.get('789800070895763476')?.commands.set([]); // Remove all guild commands
				//await client.application?.commands.create(data); // Global commands
				// await client.application?.commands.set([]); // Remove all guild commands
			}
		}
	});
};

export default registerInteraction;
