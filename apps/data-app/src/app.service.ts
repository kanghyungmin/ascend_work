import { Injectable } from '@nestjs/common';

@Injectable()
export class DataAppService {
  getHello(): string {
    return 'Hello Data APP World!';
  }
}
