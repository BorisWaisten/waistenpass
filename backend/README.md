# Easy Ticket API

Servicio backend construido con Node.js, Express y Clean Architecture.

## Scripts

- `npm run dev`: ejecuta el servidor en modo watch usando tsx.
- `npm run build`: compila a JavaScript en `dist`.
- `npm run start`: levanta el servidor compilado.
- `npm run lint`: corre ESLint sobre `src`.

## Estructura

```
src/
  domain/
  application/
  infrastructure/
  interface/
```

Cada carpeta corresponde a una capa de la arquitectura limpia. Los adapters viven en `infrastructure`, mientras que la API HTTP está bajo `interface/http`.

## Configuración

1. Crear archivo `.env` basado en `.env.example`.
2. Instalar dependencias: `npm install`.
3. Levantar MongoDB local o apuntar a una instancia existente.
4. Ejecutar `npm run dev` desde `backend/`.

## Documentación

El borrador de Swagger se encuentra en `src/interface/docs/openapi.yaml`. Se integrará con Swagger UI en próximos pasos.
