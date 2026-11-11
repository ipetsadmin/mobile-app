# Arquitectura

El código se agrupa por dominio en `src/features/`. Lo que comparten varios dominios vive en carpetas transversales. `src/app` contiene solo rutas, como exige Expo Router.

```
src/
├── app/                 Rutas de Expo Router. Solo rutas y layouts.
├── features/            Un dominio por carpeta.
│   └── {dominio}/
│       ├── screens/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── schema/
│       └── index.ts
├── components/          UI compartida y presentacional.
│   └── form/            Campos conectados a react-hook-form.
├── providers/           Providers globales que monta el layout raíz.
├── hooks/               Hooks compartidos sin dominio.
├── lib/                 Infraestructura: cliente de la API, storage, i18n.
├── constants/           theme.ts, query keys, storage keys.
└── utils/               Funciones puras.
```

Fuera de `src/` quedan la configuración (`app.json`, `eas.json`, `tsconfig.json`) y `assets/`. Las carpetas `ios/` y `android/` se generan; nunca se crean ni editan a mano.

## Features

Una feature es un dominio del producto, no una pantalla. `auth` contiene inicio de sesión, registro, verificación y recuperación; no existen features `login` y `register` por separado.

Dominios previstos: `auth`, `onboarding`, `home`, `pets`, `health`, `appointments`, `account`, `billing`.

Una feature se divide cuando reúne más de un dominio. Vacunas y citas no viven dentro de `pets`: tienen su propia feature.

### Carpetas de una feature

```
src/features/auth/
├── screens/
│   ├── sign-in-screen.tsx
│   ├── sign-up-screen.tsx
│   └── verify-account-screen.tsx
├── components/
│   ├── auth-header.tsx
│   └── code-input.tsx
├── data/
│   ├── use-sign-in.ts
│   ├── use-sign-up.ts
│   └── use-verify-email.ts
├── hooks/
│   └── use-sign-in-form.ts
├── schema/
│   └── sign-in.schema.ts
└── index.ts
```

| Carpeta | Contiene | No contiene |
|---|---|---|
| `screens/` | Un archivo por pantalla (`{nombre}-screen.tsx`). Compone componentes y usa hooks. | Navegación, llamadas directas a la API. |
| `components/` | Piezas de UI que usa más de una pantalla de la feature, o que sacan peso a una pantalla. | Pantallas completas. |
| `data/` | Hooks de React Query, uno por integración con la API. | UI, navegación, textos. |
| `hooks/` | Lógica de UI: formularios, filtros, pasos de un flujo. | Llamadas directas al cliente de la API. |
| `schema/` | Schemas de `zod` y sus tipos inferidos. | Lógica de red o de UI. |
| `index.ts` | La API pública de la feature. | Lógica. |

Cada carpeta se crea cuando hace falta. Una feature pequeña puede tener solo `screens/` e `index.ts`.

### API pública

`index.ts` es la única entrada a una feature. Exporta:

- Las pantallas, para que las consuman las rutas.
- Los hooks de `data/` y los componentes de dominio que otras features necesitan.

Todo lo demás es privado. Nadie importa un archivo interno de otra feature.

## Carpetas compartidas

### `src/app/`

Cada archivo es una ruta. Lee parámetros de la URL, renderiza una pantalla de una feature y decide a dónde navegar. No contiene estilos, lógica de negocio ni llamadas a la API. Esto vale para todas las rutas, incluidos los pasos de un flujo.

Los `_layout.tsx` definen navegadores, montan providers y protegen grupos de rutas.

### `src/components/`

UI que usan dos o más features. Es presentacional: recibe datos y callbacks por props, no consume la API y no conoce ningún dominio.

### `src/providers/`

Providers que envuelven toda la app (tema, sesión, React Query). Un provider solo conecta un estado con su contexto; la lógica del estado vive en un hook.

### `src/lib/`

Infraestructura configurada una sola vez: `api-client.ts`, `query-client.ts`, `storage.ts`, `i18n/`. No conoce ninguna feature.

### `src/hooks/`, `src/utils/`, `src/constants/`

Código transversal sin dominio. `utils/` contiene funciones puras con su test al lado. `constants/theme.ts` es la única fuente de valores visuales.

## Qué puede importar de qué

| Carpeta | Puede importar de |
|---|---|
| `app/` | `features/`, `providers/`, `components/`, `hooks/`, `lib/`, `constants/` |
| `providers/` | `features/auth`, `features/billing`, `hooks/`, `lib/`, `constants/` |
| `features/` | Otras features por su `index.ts`, `components/`, `hooks/`, `lib/`, `utils/`, `constants/` |
| `components/` | `hooks/`, `lib/`, `utils/`, `constants/` |
| `hooks/` | `providers/` (solo contextos), `lib/`, `utils/`, `constants/` |
| `lib/` | `utils/`, `constants/` |
| `utils/`, `constants/` | Nada de las carpetas anteriores |

Reglas que no admiten excepción:

- Nadie importa de `src/app/`.
- Las carpetas compartidas nunca importan de `features/`, salvo `providers/` con `auth` y `billing`.
- `expo-router` (`router`, `Link`, `Redirect`, `useLocalSearchParams`) se usa solo dentro de `src/app/`. Las pantallas reciben la navegación por callbacks.
- Las funciones de `@ipetsadmin/api-client` se importan solo en `src/lib/api-client.ts`. Sus tipos pueden importarse con `import type`.
- `useQuery` y `useMutation` se usan solo dentro de la carpeta `data/` de una feature.

## Dependencias entre features

- Una feature importa de otra solo por su `index.ts`.
- De otra feature se importan hooks de datos, componentes de dominio y tipos. Nunca pantallas.
- No hay dependencias circulares. Si `home` importa de `pets`, `pets` no importa de `home`.
- `auth` (sesión) y `billing` (permisos de pago) son la base: cualquier feature puede importarlas y ellas no importan de ninguna otra.
- Una pantalla que combina varios dominios, como el inicio, vive en su propia feature y compone a las demás.
- Lo que usan tres o más features y no pertenece a un dominio sube a las carpetas compartidas.

La sesión no guarda datos de otros dominios. Si una decisión depende de un dato del servidor, como saber si el usuario tiene mascotas, se obtiene con el hook de datos de la feature dueña.

## Dónde va algo nuevo

| Si es... | Va en |
|---|---|
| Una URL nueva | `src/app/` |
| Una pantalla | `src/features/{dominio}/screens/` |
| Una pieza de UI de un solo dominio | `src/features/{dominio}/components/` |
| Una pieza de UI que usan dos o más features | `src/components/` |
| Una llamada a la API | `src/features/{dominio}/data/` |
| La lógica de un formulario o de un flujo | `src/features/{dominio}/hooks/` |
| Una validación | `src/features/{dominio}/schema/` |
| Estado que necesita toda la app | Hook en la feature dueña o en `src/hooks/`, provider en `src/providers/` |
| Una función pura reutilizable | `src/utils/` |
| Un color, espacio, radio o fuente | `src/constants/theme.ts` |
| Un texto visible | `src/lib/i18n/locales/` |

Un componente sube de una feature a `src/components/` cuando una segunda feature lo necesita, no antes.
