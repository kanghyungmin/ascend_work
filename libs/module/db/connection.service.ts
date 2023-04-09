import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DBconnectionService {
  constructor() {}

  public async getMongoConfig() {
    return {
      uri:
        'mongodb+srv://' +
        process.env.ATLAS_MONGO_USER +
        ':' +
        process.env.ATLAS_MONGO_PWD +
        '@' +
        process.env.ATLAS_MONGO_HOST +
        '/' +
        process.env.REPL_MONGO_DB,
      // 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
