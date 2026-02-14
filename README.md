# psoft2frontend

Frontend Angular de `psoft2frontend`.

## Requisitos

- Node.js 14 recomendado para desarrollo local.
- npm.
- Docker y Docker Compose (opcional, para despliegue local con contenedor).

## Instalación

```bash
npm install
```

No es obligatorio instalar Angular CLI globalmente. Puedes usar los scripts del proyecto (`npm run ...`), que ya invocan `ng`.

## Levantar en local

Comando base:

```bash
npm start
```

La app queda en:

- `http://localhost:4200`

## Levantar con environment específico

Este proyecto tiene configuraciones en `angular.json` como:

- `local`
- `docker`
- `demo`
- `prod`
- `docker-contabo`

Ejemplo con `docker` (`environment.docker.ts`):

```bash
npm start -- --configuration=docker
```

Para ejecutar con `docker-contabo`:

```bash
npm start -- --configuration=docker-contabo
```

## Scripts útiles

- `npm start` → servidor de desarrollo.
- `npm run build` → build.
- `npm run test` → pruebas unitarias sin watch.
- `npm run test:coverage` → pruebas con cobertura.
- `npm run lint` → lint.
- `npm run format` → formateo con Prettier.

## Build por ambiente

```bash
npm run build -- --configuration=prod
```

También puedes usar: `local`, `docker`, `demo`, `docker-contabo`.

## Docker

El `docker-compose.yml` construye y levanta `angular-app` exponiendo `81:80`.

```bash
docker compose up --build -d
```

Para cambiar el ambiente de build en Docker, ajusta `BUILD_CONFIGURATION` en `docker-compose.yml`.

## Pruebas

Unit tests:

```bash
npm run test
```

Cobertura:

```bash
npm run test:coverage
```

## Calidad (SonarCloud)

El análisis usa `sonar-project.properties`.

Para ejecutar scanner manualmente:

```bash
sonar-scanner
```

Requiere token/configuración de Sonar en el entorno.

## CI/CD

Workflows en `.github/workflows`:

- `github-flow.yml`: formato, lint, tests, SonarCloud.
- `deploy-ssh.yml`: despliegue por SSH al completar CI exitoso en `main`.

Secrets esperados para deploy SSH:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PASSWORD`
- `SSH_PORT`

## Estructura relevante

- `src/environments/`: variables por ambiente.
- `docker-compose.yml`: despliegue Docker.
- `nginx.conf`: configuración de Nginx para contenedor.
- `sonar-project.properties`: configuración de Sonar.
