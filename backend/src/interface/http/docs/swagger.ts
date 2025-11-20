import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import YAML from 'yaml';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(currentDir, '../../docs/openapi.yaml');
const swaggerDocument = YAML.parse(readFileSync(schemaPath, 'utf-8'));

export const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
