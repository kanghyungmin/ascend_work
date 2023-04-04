import { NestFactory } from '@nestjs/core';
import { DataAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(DataAppModule);

  console.log(`data-app started : ${process.env.AAA}`);
  await app.listen(3000);
}
bootstrap();
