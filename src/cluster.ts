import "dotenv/config";
import { ClusterManager, ReClusterManager, HeartbeatManager } from "discord-hybrid-sharding";

const manager = new ClusterManager(`${__dirname}/index.js`,{
    totalShards: 'auto',
    shardsPerClusters: 5,
    mode: 'process',
    token: process.env.CLIENT_TOKEN
});

manager.extend(
    new ReClusterManager(),
    new HeartbeatManager({
        interval: 10000,
        maxMissedHeartbeats: 10
    })
);

manager.on('clusterCreate', (cluster : any) => {
    console.log("Successfully created cluster #" + cluster.id);
});

manager.spawn({ timeout: -1 });