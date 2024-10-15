const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.connect = true;
    this.client = createClient({ url: 'redis://localhost:6379' });
    this.client.on('error', (error) => {
      console.log(error);
      this.client = false;
    });
    this.client.on('connect', () => {
      this.connect = true;
    });
  }

  isAlive() {
    if (this.connect) return true;
    return false;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
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
