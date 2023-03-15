import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

function createOpenAPIObject(app: INestApplication, setup: (db: DocumentBuilder) => DocumentBuilder): OpenAPIObject {
  const documentBuilder = new DocumentBuilder();
  const config = setup(documentBuilder).build();
  return SwaggerModule.createDocument(app, config);
}

export function setupSwagger(app: INestApplication) {
  const document = createOpenAPIObject(app, (db: DocumentBuilder) =>
    db.setTitle('api-gateway').setVersion('1.0').addTag('api-gateway').addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token'
    )
  );

  SwaggerModule.setup('swagger', app, document);
}
