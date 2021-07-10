/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from 'discord.js';
import Event from '../../struct/Event';
import { modmsgdel } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModMessageDeleteEvent extends Event {
    constructor() {
        super({
            name: 'messageDelete',
        });
    }

    public async exec(msg: Message) {        
        if (!msg.content) return;
        if (!msg.guild) return;
        const hook = await log(msg.guild, this.client);
        if (!hook) return;
        await modmsgdel(msg, hook);
        }
    }

export default ModMessageDeleteEvent;
