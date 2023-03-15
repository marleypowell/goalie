import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

function createOpenAPIObject(app: INestApplication, setup: (db: DocumentBuilder) => DocumentBuilder): OpenAPIObject {
  const documentBuilder = new DocumentBuilder();
  const config = setup(documentBuilder).build();
  return SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });
}

export function setupSwagger(app: INestApplication, output?: boolean) {
  const document = createOpenAPIObject(app, (db: DocumentBuilder) =>
    db.setTitle('oauth-agent-service').setDescription('oauth-agent-service').setVersion('1.0').addTag('oauth')
  );

  SwaggerModule.setup('swagger', app, document);

  if (output) {
    fs.writeFileSync('libs/shared-api-client-oauth-agent/schema.json', JSON.stringify(document, null, 2));
  }
}
