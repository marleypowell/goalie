import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

function createOpenAPIObject(app: INestApplication, setup: (db: DocumentBuilder) => DocumentBuilder): OpenAPIObject {
  const documentBuilder = new DocumentBuilder();
  const config = setup(documentBuilder).build();
  return SwaggerModule.createDocument(app, config);
}

export function setupSwagger(app: INestApplication) {
  const document = createOpenAPIObject(app, (db: DocumentBuilder) =>
    db.setTitle('oauth-agent-service').setDescription('oauth-agent-service').setVersion('1.0').addTag('oauth')
  );

  SwaggerModule.setup('swagger', app, document);
}
