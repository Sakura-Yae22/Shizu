/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DMChannel, GuildChannel } from 'discord.js';
import Event from '../../struct/Event';
import { modchandel } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModChannelDeleteEvent extends Event {
    constructor() {
        super({
            name: 'channelDelete',
        });
    }

    public async exec(channel: GuildChannel | DMChannel) {
        if (channel instanceof DMChannel) return
        if (channel.guild !== null) {            
            const hook = await log(channel.guild, this.client);
            if (!hook) return;
            await modchandel(channel, hook);
        } else return
        }
    }

export default ModChannelDeleteEvent;
