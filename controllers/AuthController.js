const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect(request, response) {
    const { authorization } = request.headers;
    if (!authorization) return response.send('Unauthorized').status(401);
    const base64Credentials = authorization.split(' ')[1];
    if (!base64Credentials) return response.send('Unauthorized').status(401);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    if (!credentials) return response.send('Unauthorized').status(401);
    const [email, password] = credentials.split(':');
    if (!email || !password) return response.send('Unauthorized').status(401);
    const user = await dbClient.find('users', { email, password });
    if (user.length === 0) return response.send('Unauthorized').status(401);
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user[0].id, 86400);
    return response.send({ token }).status(200);
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
