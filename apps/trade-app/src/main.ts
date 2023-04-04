import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`trade-app started : ${process.env.BBB}`);
  await app.listen(3000);
}
bootstrap();
