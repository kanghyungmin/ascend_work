import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pathString = join(__dirname, '../../hero/hero.proto');
  console.log(`pathString: ${pathString}`);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:3002',
      package: 'trade',
      protoPath: join(__dirname, '../../../libs/grpc/proto/trade.proto'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
