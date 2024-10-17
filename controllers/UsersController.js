const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UserController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) return response.status(400).send({ error: 'Missing email' });

    if (!password) return response.status(400).send({ error: 'Missing password' });

    const userExists = await dbClient.find('users', { email });
    if (userExists.length > 0) {
      return response.status(400).send({ error: 'Already exist' });
    }

    const user = await dbClient.insert('users', {
      email,
      password: sha1(password),
    });

    return response.status(201).send({ id: user.id, email });
  }

  static async getMe(request, response) {
    const { userId } = request;
    const user = await dbClient.find('users', { id: userId });
    if (user.length === 0) {
      return response.status(404).send({ error: 'User not found' });
    }

    return response.status(200).send({ id: user[0].id, email: user[0].email });
  }
}

module.exports = UserController;
