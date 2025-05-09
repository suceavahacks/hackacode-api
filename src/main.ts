import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform : true}));

  //swagger api docs
  const config = new DocumentBuilder()
    .setTitle('Hackacode API')
    .setDescription('The Hackacode API description')
    .setVersion('1.0')
    .addTag('hackacode')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // This name here is important for reference in @ApiBearerAuth() decorator
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  console.log(`Frontend URL: ${frontendUrl}`);
  app.enableCors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PATCH", "PUT"],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
