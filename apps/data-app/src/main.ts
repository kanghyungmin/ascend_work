import { NestFactory } from '@nestjs/core';
import { DataAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { grpcClientOptions } from './grpc-client.options';

async function bootstrap() {
  const app = await NestFactory.create(DataAppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     url: 'localhost:3002',
  //     package: 'hero',
  //     protoPath: join(__dirname, '../../../libs/grpc/proto/example.proto'),
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
