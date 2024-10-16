const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.host = host;
    this.port = port;
    this.database = database;
    this.db = null;
    MongoClient.connect(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.log('eroo', error.message);
        this.client = false;
      } else {
        console.log(`DBClient connected to ${this.host}:${this.port}`);
        this.db = client.db(this.database);
      }
    });
  }

  async isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    const estimate = await this.db.collection('users').estimatedDocumentCount();
    return estimate;
  }

  async nbFiles() {
    const estimate = await this.db.collection('files').estimatedDocumentCount();
    return estimate;
  }
}

const dbClient = new DBClient();

export default dbClient;
