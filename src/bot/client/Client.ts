/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Client, Collection, Intents, ClientUser, Options } from 'discord.js';
import { CommandRegistry, EventRegistry } from '../struct/registries/export/RegistryIndex';
import { CommandOptions, EventOptions, InteractionCommandOptions } from '../types/Options';
import settings from '../settings';
import { connect } from 'mongoose';
import Kitsu from '../struct/Kitsu/Kitsu';
import ft from 'fortnite';
import log from '../struct/Logs';
import * as Anischedule from '../struct/AniSchedule';
// import * as premium from '../struct/PremiumSystem'

class Bot extends Client {
	public defaultprefix: string;
	public secret: any;
	public commands = new Collection<string, CommandOptions>();
	public interactions = new Collection<string, InteractionCommandOptions>();
	public cooldowns = new Collection<string, Collection<string, number>>();
	public icooldowns = new Collection<string, Collection<string, number>>();
	public events = new Collection<string, EventOptions>();
	public kitsu: any;
	public fortnite: any;
	public logs: any;
	public anischedule: any;
	user: ClientUser;
	public constructor() {
		super({
			/* Discord JS Client Options */
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
			],
			makeCache: Options.cacheWithLimits({
				MessageManager: 200, // This is default.
				PresenceManager: 0, // Add more class names here.
			}),
			partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'], // Cache all guild members and users upon startup, as well as upon joining a guild
			messageCacheLifetime: 700,
			messageSweepInterval: 3000,
		});

		this.defaultprefix = settings.PREFIX;
		this.secret = settings;
		this.kitsu = new Kitsu();
		this.fortnite = new ft(settings.FORTTOKEN ?? 'test');
		this.logs = log;
		this.anischedule = new Anischedule.Anischedule(this);
	}
	public start() {
		CommandRegistry(this);
		EventRegistry(this);
		super.login(settings.BOT_TOKEN);
	}
	public data() {
		connect(settings.MONGO_URL,
			{
				useFindAndModify: false,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			(err) => {
				if (err) throw err;
				else console.log('DataBase Connected');
			})
	}
	public loop(fn: { (): Promise<void>; (): void; (...args: any[]): void; }, delay: number | undefined, ...param: undefined[]) {
		fn();
		return setInterval(fn, delay, ...param);
	}
}

export default Bot;