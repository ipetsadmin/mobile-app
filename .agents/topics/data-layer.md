# Capa de datos

## Qué hace

Toda la comunicación con la API pasa por un cliente tipado y React Query. Las reglas de código están en [`data.md`](../rules/data.md); acá se explica cómo funciona.

## Piezas

| Pieza | Archivo | Rol |
|---|---|---|
| `apiClient` | `lib/api-client.ts` | Instancia única de `@ipetsadmin/api-client` con un cliente HTTP propio |
| `authClient` | `lib/auth-client.ts` | `better-auth` con el plugin de Expo; sesión y flujos de autenticación |
| `queryClient` | `lib/query-client.ts` | Configuración de React Query |
| `queryKeys` | `constants/query-keys.ts` | Claves agrupadas por dominio |
| `ApiError` | `lib/api-error.ts` | Error con `status` y mensaje |
| `uploadFile` | `lib/upload-file.ts` | Subida a una URL prefirmada con `FormData` |

## Cómo se hace una petición

1. Un hook de `data/` obtiene la cookie de sesión con `getSessionCookie()` y llama a una función de `apiClient`.
2. El cliente HTTP propio de `api-client.ts` hace `fetch` a `EXPO_PUBLIC_API_URL`, con cabecera `Content-Type` JSON, `credentials: "omit"` y la cookie en la cabecera `Cookie`.
3. Cada petición tiene un tiempo máximo de 20 segundos; al vencer se lanza `ApiError` con estado 0 y mensaje `REQUEST_TIMEOUT`.
4. Si la respuesta no es correcta, lanza `ApiError(status, message)` con el mensaje de la API si lo hay.
5. Si la respuesta es 401 y la petición llevaba cookie, cierra la sesión y vacía la caché (`endSession`), una sola vez a la vez.

## React Query

- Consultas: 2 reintentos como máximo, salvo con 401, que no se reintenta. `staleTime` de 60 segundos.
- Mutaciones: sin reintentos.
- Las consultas que dependen de la sesión usan `skipToken` mientras no hay usuario.
- Los hooks de consulta desenvuelven `IApiResponse` con `select`, así que las pantallas reciben el dato ya limpio.

## Claves e invalidaciones

| Dominio | Claves | Quién las invalida |
|---|---|---|
| `pets` | `all`, `list(userId)`, `detail(petId)` | alta, edición y foto de mascota; alta de vacuna o tratamiento (`detail`) |
| `treatments` | `all`, `list(petId)` | alta de vacuna o tratamiento |
| `appointments` | `all`, `list(petId)` | alta de cita |
| `account` | `all`, `profile(userId)` | edición de perfil, foto de perfil, preferencias de notificaciones |
| `agenda` | `all`, `list(userId, days)` | alta de mascota, edición, foto, vacuna, tratamiento y cita |

Regla práctica: toda mutación invalida la clave `all` de lo que cambia y de lo que se deriva de ello, como la agenda.

## Sesión

La sesión no vive en React Query: la entrega `authClient.useSession()` (ver [`session-and-bootstrap.md`](./session-and-bootstrap.md)). Los tokens se guardan en `expo-secure-store`.

## Archivos clave

`lib/`, `constants/query-keys.ts`, `features/*/data/`.

## Pruebas

Sin pruebas todavía. La fase 3 de [`testing.md`](../rules/testing.md) cubre los hooks de `data/` mockeando `apiClient`; `ApiError` y la política de reintentos de `query-client` son candidatos de fase 1.
