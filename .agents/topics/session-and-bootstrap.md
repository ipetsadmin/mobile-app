# Sesión y arranque

## Qué hace

Decide qué ve el usuario al abrir la app: splash mientras carga, el grupo público si no hay sesión o el grupo de la app si la hay.

## Flujo de arranque

1. `app/_layout.tsx` llama a `SplashScreen.preventAutoHideAsync()` y carga las fuentes (Geom, Iosevka Charon y Playwrite NZ Basic).
2. `useStoredPreferences` lee de `AsyncStorage` el tema y el idioma guardados y aplica el idioma. No se renderiza nada hasta tener fuentes y tema.
3. Se monta `AppProviders` (gestos, React Query, teclado, tema) y `SplashProvider`.
4. `RootStack` usa `useAppBootstrap`, que considera la app lista cuando las fuentes están listas y:
   - la sesión terminó de cargar, y
   - si hay sesión, la lista de mascotas ya cargó.
   Si eso no ocurre en 4 segundos, se da por lista de todas formas.
5. Con la app lista, se muestra el `Stack` con dos grupos protegidos con `Stack.Protected`: `(public)` si no hay sesión y `(app)` si la hay. `SplashOverlay` se retira al terminar su animación.

## Primera mascota

El layout de `(app)` espera a que la lista de mascotas se resuelva, una sola vez. Si el usuario no tiene ninguna, abre `/new-companion`. Mientras no tenga mascotas, esa pantalla no se puede cerrar ni con gesto ni con el botón de retroceso de Android.

## Datos

- Sesión: `useAuthSession` (`authClient.useSession()`).
- Mascotas: `usePets`, que se consulta solo con sesión.

## Detalles a tener en cuenta

- Si una petición autenticada recibe 401, `src/lib/api-client.ts` llama a `endSession`: cierra la sesión y vacía la caché. El guard de la raíz lleva entonces al usuario al login.
- Cerrar sesión no navega nunca; cambia el estado y el guard redirige.
- La animación del splash está en `features/splash` (`useIntroTimeline`), con fases de 4 etapas.

## Archivos clave

`app/_layout.tsx`, `app/(app)/_layout.tsx`, `features/splash/`, `providers/app-providers.tsx`, `hooks/use-stored-preferences.ts`, `lib/api-client.ts`.

## Pruebas

Sin pruebas todavía. `useAppBootstrap` es candidato de fase 4 (hooks de lógica).
