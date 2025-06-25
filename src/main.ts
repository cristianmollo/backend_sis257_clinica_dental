import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Api Rest Laboratorio sis257')

    .setDescription(
      'Api Rest de la materia Desarrollo de Aplicaciones Int/Internet II',
    )
    .setVersion('1.0')
    .addTag('citas, clientes, horarios, odontlogo_servicios, odontologos,roles,servicios, auth') //se añade una etiqueta a la documentación
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(process.env.PORT);
  console.log(`App corriendo: ${await app.getUrl()}/apidoc`);
}
bootstrap();
function addBearerAuth(arg0: { type: string; scheme: string; bearerFormat: string; in: string; }) {
  throw new Error('Function not implemented.');
}

