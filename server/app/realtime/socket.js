import { Server } from 'socket.io';
import { createClient } from 'redis';

const REDIS_CHANNEL = 'trading-system:market-events';

let io;
let publisher;
let subscriber;
let redisInitialized = false;

const createRedisClients = async () => {
  if (redisInitialized) {
    return;
  }

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    redisInitialized = true;
    console.info('Redis is not configured. Running realtime updates over websockets only.');
    return;
  }

  publisher = createClient({ url: redisUrl });
  subscriber = publisher.duplicate();

  publisher.on('error', (error) => {
    console.warn('Redis publisher error:', error.message);
  });

  subscriber.on('error', (error) => {
    console.warn('Redis subscriber error:', error.message);
  });

  try {
    await Promise.all([publisher.connect(), subscriber.connect()]);

    await subscriber.subscribe(REDIS_CHANNEL, (message) => {
      if (!io) {
        return;
      }

      try {
        const event = JSON.parse(message);
        io.emit(event.type, event.payload);
      } catch (error) {
        console.warn('Failed to process redis event:', error.message);
      }
    });

    redisInitialized = true;
  } catch (error) {
    console.warn('Redis unavailable, continuing with websocket broadcasts:', error.message);
    try {
      await Promise.allSettled([publisher?.disconnect(), subscriber?.disconnect()]);
    } catch {
      // Ignore cleanup errors and continue websocket-only.
    }
    publisher = null;
    subscriber = null;
    redisInitialized = true;
  }
};

export const initRealtime = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.emit('realtime:ready', {
      message: 'Connected to trading updates',
    });
  });

  await createRedisClients();

  return io;
};

export const  publishRealtimeEvent = async (type, payload) => {
  const event = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  const message = JSON.stringify(event);

  if (publisher) {
    try {
      await publisher.publish(REDIS_CHANNEL, message);
      return true;
    } catch (error) {
      console.warn('Redis publish failed, falling back to direct websocket emit:', error.message);
    }
  }

  if (io) {
    io.emit(type, payload);
  }

  return false;
};
