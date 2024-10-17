const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect(request, response) {
    const { authorization } = request.headers;
    if (!authorization) return response.send('Unauthorized').status(401);
    const token = authorization.split(' ')[1];
    if (!token) return response.send('Unauthorized').status(401);

    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const user = await dbClient.find('users', { email, password });
    // const userId = await redisClient.get(`auth_${token}`);
    // if (!userId) return response.send('Unauthorized').status(401);
    // const user = await dbClient.find('users', { id: userId });

    // const { email, password } = request.body;
    // const user = await dbClient.find('users', { email, password });
    console.log(user);
    if (user.length === 0) return response.send('User not found').status(401);
    const usertoken = uuidv4();
    const key = `auth_${usertoken}`;
    redisClient.set(key, user[0].id, 24 * 60 * 60);
    return response.send({ token: 'hello' }).status(200);
  }

  static async getDisconnect(request, response) {
    const { authorization } = request.headers;
    if (!authorization) return response.send('Unauthorized').status(401);
    const token = authorization.split(' ')[1];
    if (!token) return response.send('Unauthorized').status(401);
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return response.send('Unauthorized').status(401);
    redisClient.del(`auth_${token}`);
    return response.send('Disconnect').status(200);
  }
}

module.exports = AuthController;
