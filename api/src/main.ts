import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // Try different path strategies
  let buildPath: string;
  let indexPath: string;

  // For development (when running from api folder)
  const devPath: string = join(__dirname, '..', '..', 'ui', 'dist');
  // For production (when running from root)
  const prodPath: string = join(process.cwd(), 'ui', 'dist');

  console.log('Checking paths:');
  console.log('Dev path:', devPath);
  console.log('Prod path:', prodPath);
  console.log('Dev path exists:', existsSync(devPath));
  console.log('Prod path exists:', existsSync(prodPath));

  if (existsSync(devPath)) {
    buildPath = devPath;
    console.log('Using dev path');
  } else if (existsSync(prodPath)) {
    buildPath = prodPath;
    console.log('Using prod path');
  } else {
    console.error('Could not find UI build directory');
    console.error('Make sure to run: cd ui && npm run build');
    buildPath = prodPath; // fallback
  }

  indexPath = join(buildPath, 'index.html');
  console.log('Final build path:', buildPath);
  console.log('Final index path:', indexPath);
  console.log('Index file exists:', existsSync(indexPath));

  // Serve static files
  app.use(express.static(buildPath));

  // Handle client-side routing
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.url.startsWith('/api')) {
      if (existsSync(indexPath)) {
        res.sendFile(resolve(indexPath));
      } else {
        res.status(404).json({
          message: 'React app not found. Please build the UI first.',
          buildPath,
          indexPath,
        });
      }
    } else {
      next();
    }
  });

  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
