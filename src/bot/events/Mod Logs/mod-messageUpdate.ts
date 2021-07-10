/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from 'discord.js';
import Event from '../../struct/Event';
import { modmsgedit } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModMessageUpdateEvent extends Event {
    constructor() {
        super({
            name: 'messageUpdate',
        });
    }

    public async exec(oldmsg: Message, newmsg: Message) {
        if (!oldmsg.author || !newmsg.author) return;
        if (oldmsg.author.bot) return
        if (oldmsg.content === newmsg.content) return;
        if (!oldmsg.guild) return;
        const hook = await log(oldmsg.guild, this.client);
        if (!hook) return;
        await modmsgedit(oldmsg, newmsg, hook);

    }
}

export default ModMessageUpdateEvent;
