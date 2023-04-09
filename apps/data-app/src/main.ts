import { NestFactory } from '@nestjs/core';
import { DataAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(DataAppModule);
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
