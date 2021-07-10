import { ShardingManager } from 'discord.js';
import Settings from './bot/settings';

const Manager = new ShardingManager('./dist/bot.js', 
{
    totalShards: 2,
    mode: 'worker',
    respawn: true,
    token: Settings.BOT_TOKEN
}
);
Manager.spawn();
Manager.on("shardCreate", (shard) => {
    console.log(`Successfully launched shard ${shard.id} of ${Manager.totalShards}`);
    //if(shard.id === 0) {
     // Refresh exports before the first shard spawns.
     // This is done on launch because it requires totalShards to be a number.
     //refreshGameExports();//
    //}
   
    // TODO: Rate limit this to prevent API flooding
    shard.on("death", (process) => {
     console.error("Shard " + shard.id + " closed unexpectedly! PID: " + process.pid + "; Exit code: " + process.exitCode + ".");
   
     if(process.exitCode === null)
     {
      console.warn("WARNING: Shard " + shard.id + " exited with NULL error code. This may be a result of a lack of available system memory. Ensure that there is enough memory allocated to continue.");
     }
    });
   
    shard.on("disconnect", (event) => {
     console.warn("Shard " + shard.id + " disconnected. Dumping socket close event...");
     console.log(event);
    });
   
    //shard.on("reconnecting", () => {
    //  console.warn("Shard " + shard.id + " is reconnecting...");
    //});
   });