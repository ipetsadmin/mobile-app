# Auth

## Qué hace

Autentica al usuario con correo y contraseña o con proveedor social, verifica el correo con un código de un solo uso y permite recuperar la contraseña. La sesión la gestiona `better-auth` (ver [`session-and-bootstrap.md`](./session-and-bootstrap.md)).

## Pantallas y rutas

Todas están en el grupo público `src/app/(public)/`, accesible solo sin sesión.

| Ruta | Pantalla | Recibe |
|---|---|---|
| `/` | `SignInScreen` | — |
| `/sign-up` | `SignUpScreen` | — |
| `/verify-email` | `VerifyAccountScreen` | `email` (si falta, redirige a `/`) |
| `/reset-password` | `ResetPasswordScreen` | — |
| `/new-password` | `NewPasswordScreen` | `token` (si falta, redirige a `/`) |

La navegación la deciden las rutas por callbacks; las pantallas no navegan.

## Flujo

**Inicio de sesión.** `useSignInForm` valida con `sign-in.schema` y llama a `useSignIn` (`authClient.signIn.email`).
- Si la API responde que el correo no está verificado, o `emailVerified` es `false`, `useSignIn` cierra la sesión recién abierta y lanza un error 403. El formulario guarda las credenciales en memoria (`pending-credentials`), reenvía el código y navega a `/verify-email`.
- Cualquier otro error muestra un toast con la clave de `getSignInErrorKey` (403, 401 o genérico).
- Al iniciar sesión, el guard de la raíz saca al usuario del grupo público.

**Registro.** `useSignUpForm` llama a `useSignUp` y concatena nombre y apellido en `name`. Si sale bien, guarda las credenciales en memoria y navega a `/verify-email`. Los errores se traducen con `getSignUpErrorKey`.

**Verificación.** `useVerifyAccountForm` envía el código a `useVerifyEmail` (`apiClient.auth.verifyEmail`). Si es válido, inicia sesión sola con la contraseña guardada en memoria. Si no la tiene (por ejemplo, tras reiniciar la app), manda al usuario a iniciar sesión. `useResendCode` reenvía el código con un enfriamiento de 30 segundos.

**Social.** `useSocialSignIn` abre el flujo de `better-auth` para `google` o `apple`.

**Recuperar contraseña.** `useRequestPasswordReset` pide el correo con `redirectTo` apuntando a `/new-password` (enlace profundo con `expo-linking`). El enlace trae `token`; `useSetNewPassword` lo usa para fijar la contraseña y la app vuelve a `/`.

**Cerrar sesión.** `useSignOutAction` pide confirmación con un `Alert`. `useSignOut` cierra la sesión, borra las credenciales pendientes y vacía la caché de React Query. No navega: al cambiar la sesión, el layout raíz redirige. Se usa desde la pestaña de cuenta.

## Datos

No usa caché de React Query para la sesión: `useAuthSession` envuelve `authClient.useSession()`. Las mutaciones de `data/` llaman directo a `authClient`, salvo `useVerifyEmail`, que usa `apiClient.auth`.

## Detalles a tener en cuenta

- Las credenciales pendientes viven solo en memoria de módulo y se borran al iniciar sesión, al volver al login y al cerrar sesión. Nunca se persisten.
- Los tokens los guarda `expo-secure-store` con el prefijo `truffa` (ver `src/lib/auth-client.ts`).
- Mientras el usuario no tenga mascotas, el layout de `(app)` lo lleva a crear la primera (ver [`companions.md`](./companions.md)). Ese flujo ya no ofrece cerrar sesión.

## Archivos clave

`features/auth/`, `lib/auth-client.ts`, `app/(public)/`, `app/_layout.tsx`.

## Pruebas

Fases 1 a 3 completas: los utils, los cinco schemas y los nueve hooks de `data/` (`useSignIn` incluye el caso de correo sin verificar, `useSignOut` que limpia credenciales y caché, y el resto con éxito y error). Faltan los formularios y `useResendCode` (fase 4) y las pantallas (fase 6).
