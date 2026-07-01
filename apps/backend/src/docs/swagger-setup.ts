import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

interface ConfigYaml {
  title: string;
  version: string;
  description: string;
  path: string;
}

export const swaggerSetup = (app: INestApplication) => {
  const configFile = fs.readFileSync(path.join(__dirname, 'swagger.yml'), 'utf8');

  const configYaml = yaml.load(configFile) as ConfigYaml;

  const builder = new DocumentBuilder()
    .setTitle(configYaml.title)
    .setVersion(configYaml.version)
    .setDescription(configYaml.description)
    .build();

  const document = SwaggerModule.createDocument(app, builder);

  SwaggerModule.setup(configYaml.path, app, document);
};
