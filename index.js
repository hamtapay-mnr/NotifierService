import { Cache } from './Src/Infrastructure/cache.js';
import { EventQueue } from './Src/Infrastructure/eventQueue.js';
import { createClient } from 'redis';
import { NotifierController } from './Src/Controller/notifierController.js';

// Load Dependencies
const redis = createClient();
redis.on('error', err => console.log('Redis Client Error', err));
await redis.connect();

// Inject dependencies
const eventQueue = new EventQueue(redis);
await eventQueue.initStream();
const cache = new Cache(redis);
console.log(2222222222, cache);
const notifierController = new NotifierController(cache, eventQueue);

console.log("Start listening to order queue");
await eventQueue.consumeEvent(notifierController.newFactor.bind(notifierController));
redis.quit();