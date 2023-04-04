import { NestFactory } from '@nestjs/core';
import { DataAppModule } from './data-app.module';

async function bootstrap() {
  const app = await NestFactory.create(DataAppModule);
  await app.listen(3000);
}
bootstrap();
