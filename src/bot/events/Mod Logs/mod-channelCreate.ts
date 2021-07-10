/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GuildChannel } from 'discord.js';
import Event from '../../struct/Event';
import { modchancre } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModChannelCreateEvent extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    public async exec(channel: GuildChannel) {
        if (channel.guild !== null) {            
            const hook = await log(channel.guild, this.client);
            if (!hook) return;
            await modchancre(channel, hook);
        } else return
        }
    }

export default ModChannelCreateEvent;
