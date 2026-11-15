# Navegación

## Qué hace

Expo Router define las pantallas con rutas de archivo en `src/app/`. Las rutas solo conectan una pantalla con la navegación; ninguna pantalla de una feature navega por su cuenta (ver [`architecture.md`](../rules/architecture.md)).

## Árbol de rutas

```
src/app/
├── _layout.tsx            Raíz: fuentes, providers, splash y guard de sesión
├── (public)/              Sin sesión: sign-in (/), sign-up, verify-email, reset-password, new-password
└── (app)/                 Con sesión
    ├── _layout.tsx        Stack; abre /new-companion si no hay mascotas
    ├── (tabs)/            Pestañas nativas
    │   ├── (home)/        Inicio
    │   ├── companions/    Lista (index) y detalle ([petId])
    │   └── account/       Cuenta
    ├── new-companion/     Alta paso a paso (modal desde abajo)
    ├── edit-companion/[petId]/   Edición paso a paso
    ├── health-card/[petId]
    ├── new-vaccine, new-treatment, new-appointment
    ├── notifications
    └── profile/           edit, password, language, notifications, household
```

## Protección de rutas

El layout raíz usa `Stack.Protected`: `(public)` solo si no hay sesión y `(app)` solo si la hay. Cerrar sesión no navega; cambia el estado y el guard redirige (ver [`session-and-bootstrap.md`](./session-and-bootstrap.md)).

## Pestañas

`(tabs)/_layout.tsx` usa `NativeTabs` con tres pestañas: inicio (`(home)`), compañeros (`companions`) y cuenta (`account`), con iconos SF Symbols en iOS y de Material en Android. El color de acento y el fondo vienen del tema.

## Presentación

- `new-companion` y `edit-companion` se abren con animación `slide_from_bottom`. En `new-companion`, `gestureEnabled` es falso mientras el usuario no tenga mascotas.
- Las pantallas de formulario (`new-vaccine`, `new-treatment`, `new-appointment`, `profile/*`, `health-card`) tienen encabezado estándar con título traducido, definido en `(app)/_layout.tsx` con `useHeaderOptions`.
- `notifications` usa encabezado de título grande.

## Cerrar un flujo

- Una pantalla simple vuelve con `router.back()`.
- Un flujo con layout propio (alta o edición de mascota) se cierra con `useCloseFlow`, que vuelve desde el navegador padre para salir del grupo completo.

## Parámetros

Los parámetros se leen con `useLocalSearchParams` en la ruta y se pasan como props a la pantalla. Cuando un parámetro obligatorio falta (`email` en `verify-email`, `token` en `new-password`), la ruta redirige a `/`.

## Archivos clave

`app/_layout.tsx`, `app/(app)/_layout.tsx`, `app/(app)/(tabs)/_layout.tsx`, `hooks/use-close-flow.ts`, `hooks/use-header-options.ts`.

## Pruebas

Sin pruebas. Las rutas son la fase 7 y están bloqueadas por la versión de `@testing-library/react-native` (ver [`testing.md`](../rules/testing.md)).
