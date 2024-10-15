import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({ url: 'redis://localhost:6379' });
    this.client.on('error', (error) => {
      console.log(error);
    });
    this.client.connect();
  }

  isAlive() {
    if (this.client.connect) {
      return true;
    }
    return false;
  }

  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
