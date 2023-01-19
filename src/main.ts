import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  // Make sure we are running node 19.4.0 if we are running the app locally
  if (process.env.NODE_ENV === 'development') {
    const latestNodeVersion = '19.4.0';
    if (process.versions.node !== latestNodeVersion) {
      console.log('Running the app requires node 19.0.4');
      process.exit();
    }
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
