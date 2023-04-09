import { Global, Module } from '@nestjs/common';

import { DBconnectionService } from './connection.service';

@Global()
@Module({
  providers: [DBconnectionService],
  exports: [DBconnectionService],
})
export class DBconnectionMoudle {}
