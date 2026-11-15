# Truffa

App móvil de Truffa construida con [Expo](https://expo.dev) (SDK 57), React Native y Expo Router.

## Empezar

```bash
npm install
npx expo start
```

`npm install` también instala los hooks de git (Husky). Para correr la app necesitas un development build: `npm run ios` o `npm run android`.

Copia las variables de entorno a `.env.local`; la API se lee de `EXPO_PUBLIC_API_URL`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo de Expo |
| `npm run ios` / `npm run android` | Compila y abre la app en el simulador o emulador |
| `npm run biome:check` | Formato, imports y reglas de Biome sobre `src/` (con `--write`) |
| `npx expo lint` | Lint de Expo (ESLint) |
| `npm run typecheck` | Revisión de tipos con TypeScript |
| `npm test` | Pruebas unitarias con Jest |

## Estructura

```
src/
├── app/         Rutas de Expo Router
├── features/    Un dominio por carpeta (screens, components, data, hooks, schema)
├── components/  UI compartida
├── hooks/       Hooks sin dominio
├── lib/         Cliente de la API, storage, i18n
├── constants/   Tema, query keys
├── utils/       Funciones puras
└── test/        Setup, helpers y factories de pruebas
```

## Calidad antes de cada commit

Husky bloquea el commit si algo falla:

1. Biome sobre los archivos del commit.
2. `tsc --noEmit`.
3. `expo lint`.
4. `jest --ci`.

El mensaje se valida con commitlint (conventional commits, por ejemplo `fix(pet): invalidate pet list after create`).

## Reglas del proyecto

Las reglas de arquitectura, estilo, componentes, estilos, datos, formularios, textos, pruebas y commits viven en [`.agents/rules/`](./.agents/rules/orquestador.md). Cómo funciona cada flujo (auth, perfil, mascotas, salud, citas, agenda, notificaciones) y cada capa (navegación, datos, idioma y tema) está en [`.agents/topics/`](./.agents/topics/index.md). El punto de entrada es [`orquestador.md`](./.agents/rules/orquestador.md); [`AGENTS.md`](./AGENTS.md) lo referencia para los agentes de código.
