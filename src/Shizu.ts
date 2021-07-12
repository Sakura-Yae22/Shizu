import Client from "./bot/client/Client";
import "dotenv/config";
const client: Client = new Client();
client.start();
client.data();
