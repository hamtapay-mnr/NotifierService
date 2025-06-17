import { Cache } from './Src/Infrastructure/cache.js';
import { EventQueue } from './Src/Infrastructure/eventQueue.js';
import { createClient } from 'redis';
import { NotifierController } from './Src/Controller/notifierController.js';

// Simulate .env file (no internet to npm i dotenv!)
process.env.STREAM_KEY_READ = 'price-factor';
process.env.STREAM_KEY_WRITE = 'user-factor';
process.env.STREAM_KEY_WRITE_ADMIN = 'admin-warning';
process.env.GROUP_NAME = 'order_group';
process.env.CONSUMER_NAME = 'notifier_service';

// Load Dependencies
console.log("Initial dependencies");

// Load cache, queue object
const redis = createClient();
redis.on('error', err => console.log('Redis Client Error', err));
await redis.connect();

// Inject dependencies
const eventQueue = new EventQueue(redis, process.env.STREAM_KEY_READ, process.env.STREAM_KEY_WRITE, process.env.GROUP_NAME, process.env.CONSUMER_NAME);
const adminEventQueue = new EventQueue(redis, '', process.env.STREAM_KEY_WRITE_ADMIN, process.env.GROUP_NAME, process.env.CONSUMER_NAME);
await eventQueue.initStream();
await adminEventQueue.initStream();
const cache = new Cache(redis);
const notifierController = new NotifierController(cache, eventQueue, adminEventQueue);

await eventQueue.consumeEvent(notifierController.newFactor.bind(notifierController));
redis.quit();