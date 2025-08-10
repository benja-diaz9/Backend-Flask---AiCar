# AiCar Front

Frontend minimalista en React + Vite para interactuar con el backend actual.

## Requisitos
- Node.js 18+

## Variables de entorno
Crea un archivo `.env` en `front/` (opcional):

```
VITE_BACKEND_URL=http://localhost:8080
```

Si no se define, se usará `http://localhost:8080` por defecto.

## Desarrollo

```bash
cd front
npm install
npm run dev
```

## Build de producción

```bash
cd front
npm install
npm run build
npm run preview
```

La landing incluye un buzón para escribir el primer mensaje; al enviar, llama a `/start` y luego a `/chat` del backend.

