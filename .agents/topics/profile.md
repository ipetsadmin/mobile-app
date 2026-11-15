# Perfil y cuenta

## Qué hace

Muestra y edita los datos de la cuenta: nombre, foto, contraseña, idioma, apariencia y preferencias de notificaciones. También es donde el usuario cierra sesión.

## Pantallas y rutas

| Ruta | Pantalla |
|---|---|
| Pestaña `account` (`(tabs)/account`) | `AccountScreen`: tarjeta de perfil, ajustes y cerrar sesión |
| `/profile/edit` | `EditProfileScreen` |
| `/profile/password` | `ChangePasswordScreen` |
| `/profile/language` | `LanguageScreen` |
| `/profile/notifications` | `NotificationPreferencesScreen` |
| `/profile/household` | Pantalla de relleno (`PlaceholderScreen`); todavía no tiene funcionalidad |

## Flujo

**Leer la cuenta.** `useAccount` consulta el perfil (`apiClient.users.getProfile`) solo cuando hay sesión. Arma un objeto `account` con nombre, apellido, nombre completo, correo, foto y preferencias de notificaciones. Si el perfil no trae nombre, usa el de la sesión; los valores por defecto son push desactivado y correo activado.

**Editar perfil.** `useEditProfileForm` carga los valores de `useAccount` en el formulario sin pisar lo que el usuario ya escribió. Al guardar, `useUpdateProfile` envía nombre y apellido. Si hay una foto nueva distinta a la actual, después sube la foto con `useUploadAvatar`. Se cierra la pantalla solo cuando todo terminó bien; si falla, el formulario conserva lo escrito y se muestra un toast.

**Subir foto.** `useUploadAvatar` pide una URL prefirmada (`prepareAvatarUpload`), sube el archivo con `uploadFile` y confirma con `confirmAvatarUpload`.

**Cambiar contraseña.** `useChangePassword` usa `authClient.changePassword` con `revokeOtherSessions: true`, es decir, cierra las demás sesiones del usuario.

**Idioma.** `useLanguageSetting` cambia el idioma de i18n al instante y lo guarda en `AsyncStorage` (ver [`i18n-and-theme.md`](./i18n-and-theme.md)).

**Apariencia.** `AppearanceSetting` cambia la preferencia de tema (ver [`i18n-and-theme.md`](./i18n-and-theme.md)).

**Notificaciones.** `useNotificationPreferences` combina permiso del sistema y preferencias guardadas (ver [`notifications.md`](./notifications.md)).

## Datos

- Consulta: `useAccount`, clave `queryKeys.account.profile(userId)`.
- Mutaciones (`useUpdateProfile`, `useUploadAvatar`): invalidan `queryKeys.account.all`.
- `useChangePassword` no toca la caché.

## Detalles a tener en cuenta

- `useAccount` se importa desde otras features (home, mascotas) para saludar y mostrar el cuidador, por eso está en el `index.ts` de la feature.
- El correo no es editable.

## Archivos clave

`features/account/`, `app/(app)/(tabs)/account/`, `app/(app)/profile/`, `lib/upload-file.ts`.

## Pruebas

Fase 2 completa: schemas `edit-profile` y `change-password`. Faltan la conversión de `useAccount` a `account` y los hooks de `data/` (fase 3), y los formularios y preferencias (fase 4).
