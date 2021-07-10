/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Discord, { ColorResolvable, TextChannel } from 'discord.js';

async function logs(message: Discord.Message, error, type) {

	if (!message) {
		throw new ReferenceError("Nekoyasui => 'message' must be passed down as param! (logs)");
	}
	if (!error) {
		throw new ReferenceError("Nekoyasui => 'error' must be passed down as param! (logs)");
	}
	if (!type) {
		throw new ReferenceError("Nekoyasui => 'type' must be passed down as param! (logs)");
	}
	if (message.channel instanceof Discord.DMChannel) return;

	// tslint:disable-next-line: one-variable-per-declaration
	const PrettyError = require('pretty-error'),
		pe = new PrettyError();
	pe.withoutColors();

	let name = error.name || 'N/A';
	const stack = pe.render(error) || 'N/A';
	const content = message.content || 'N/A';
	let avatar;
	const channel = message.channel as TextChannel;
	if (name.includes('TypeError')) {
		name = 'Type Error';
		avatar = 'https://i.imgur.com/KplPh0v.png';
	} else
		if (name.includes('DiscordAPIError')) {
			name = 'DiscordApi Error';
			avatar = 'https://i.imgur.com/B4DLa65.png';
		} else
			if (name.includes('MISSING_PERMISSIONS')) {
				name = 'Missing Permission';
				avatar = 'https://i.imgur.com/AHhWpZM.png';
			} else
				if (name.includes('FetchError')) {
					name = 'Fetch Error';
					avatar = 'https://i.imgur.com/VbMK69L.png';
				} else
					if (error.stack.includes('fetch the api')) {
						name = 'Api Error';
						avatar = 'https://i.imgur.com/zA5WdW1.png';
					} else {
						avatar = 'https://i.imgur.com/a3f0ftB.png';
					}
	const errors = BaseEmbed(message, name, avatar)
		.setTitle('An problem happened when you were executing the command.')
		.setDescription(`\`\`\`xl\n${stack}  - command executed: ${content}${message.guild ? `\n\n  - guild report: ${cleanGuildName(message.guild.name)}` : ''}\`\`\` `);
	// Webhook
	try {
		//const webhooks = await message.channel.fetchWebhooks();
		// let webhook;
		//webhook = webhooks.first();
		//if (webhook) {
		// 	console.log("Nekoyasui => 'webhook' edited (logs)");
		// 	await webhook.edit({ name: name, avatar: avatar });
		// } else {
		// 	console.log("Nekoyasui => 'webhook' created (logs)");
		// 	webhook = await message.channel.createWebhook(name, { avatar });
		// }

		// await webhook.send({ embed: errors });
		// setTimeout(async () => {
		// 	await webhook.delete();
		// 	console.log("Nekoyasui => 'webhook' deleted (logs)");
		// }, 9e3);
		channel.send({ embeds: [errors] })

	} catch (e) {
		return
	}
}

// async function webhook(channel, content, { username = 'Miwa' , avatar = ''} = {}) {

// const webhooks = await channel.fetchWebhooks();
// let webhook;
// webhook = webhooks.first();
// if (webhook) {
// 	console.log("Nekoyasui => 'webhook' edited (logs)");
// 	await webhook.edit({ name: username, avatar: avatar });
// } else {
// 	console.log("Nekoyasui => 'webhook' created (logs)");
// 	webhook = await channel.createWebhook.createWebhook(username, { avatar });
// }

// await webhook.send({ embed: content });
// setTimeout(async () => {
// 	await webhook.delete();
// 	console.log("Nekoyasui => 'webhook' deleted (logs)");
// }, 9e3);
// }

// String.prototype.Nekoreplace = function(Old, New, Ignore) {
// 	return this.replace(new RegExp(Old.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,'\\$&'), (Ignore?'gi':'g')), (typeof(New)=='string') ? New.replace(/\$/g,'$$$$') : New);
// };

function cleanGuildName(name) {
	// tslint:disable-next-line: one-variable-per-declaration
	// const ignoreReg = [
	// 	'(( *)(servers|server|guilds|guild|officials|official))',
	// 	'((servers|server|guilds|guild|officials|official)( *))',
	// 	'((servers|server|guilds|guild|officials|official))', ],
	// 	ignore = new RegExp(ignoreReg.join('|'), 'i');

	return name.toLowerCase()
		.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
		// .Nekoreplace(ignore, '')
		// tslint:disable-next-line: restrict-plus-operands
		.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function BaseEmbed(message, name, avatar, { color = '#36393f' } = {}) {
	if (!(message)) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (BaseEmbed)");
	const avataruser = message.author.displayAvatarURL({ size: 4096, dynamic: true });

	return new Discord.MessageEmbed().setFooter(message.author.username, avataruser).setColor(color as ColorResolvable).setTimestamp()
		.setAuthor(name, avatar);
}
export default logs;