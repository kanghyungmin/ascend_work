import { NestFactory } from '@nestjs/core';
import { DataAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { grpcClientOptions } from './grpc-client.options';

async function bootstrap() {
  const app = await NestFactory.create(DataAppModule);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
