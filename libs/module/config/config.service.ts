import * as dotenv from 'dotenv';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ConfigService {
  //   private readonly envConfig: EnvConfig;

  constructor(@Inject('CONFIG_OPTIONS') private options: Record<string, any>) {
    dotenv.config({ path: options.envPath });
  }
}
