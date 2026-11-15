# Notificaciones

## Qué hace

Gestiona el permiso de notificaciones del sistema y las preferencias de push y correo del usuario. La lista de avisos dentro de la app es la agenda (ver [`agenda-and-home.md`](./agenda-and-home.md)).

## Pantallas y rutas

- Preferencias: `/profile/notifications` (`NotificationPreferencesScreen`, de la feature `account`).
- Aviso inicial: una alerta nativa que dispara `usePushPrompt` desde el inicio.

## Flujo

**Permiso.** `useNotificationPermission` lee el estado del sistema (`granted`, `denied` o `undetermined`) y lo refresca cada vez que la app vuelve a primer plano. Al pedirlo en Android crea antes el canal `default`.

**Aviso inicial.** `usePushPrompt` se activa en el inicio cuando terminó el splash y el usuario ya tiene mascotas. Si el permiso está sin decidir y el usuario nunca respondió, muestra una alerta: "Permitir" pide el permiso y, si lo concede, guarda `push: true`; "Más tarde" lo marca como respondido. La respuesta se guarda en `AsyncStorage` (`push-prompt-answered`), así que no vuelve a preguntar.

**Preferencias.** `useNotificationPreferences` (en `account`) muestra los interruptores de push y correo:
- Activar push pide el permiso si hace falta; si el sistema lo deniega, muestra un toast y no guarda.
- Si el permiso está denegado definitivamente, ofrece abrir los ajustes del sistema.
- Mientras se guarda, el interruptor refleja el valor pendiente.

## Datos

- `useUpdateNotificationPreferences`: `users.patchPreferences` con `{ push, email }`. Invalida `account.all`.
- Las preferencias se leen desde `useAccount` (ver [`profile.md`](./profile.md)): push desactivado y correo activado por defecto.

## Detalles a tener en cuenta

- `push` activo en el servidor no implica permiso del sistema; la pantalla muestra push como activo solo si ambos lo están.
- Esta feature exporta hooks y tipos; la lista de avisos usa `useNotifications`, que vive en la misma feature pero consume la agenda.

## Problema conocido

`usePushPrompt` decide con el permiso que tenía el hook al montarse: `useNotificationPermission` empieza en `undetermined` hasta leer el estado real del sistema. Si el usuario ya concedió el permiso pero nunca respondió el aviso (por ejemplo, lo activó antes desde los ajustes de la cuenta), el aviso aparece igual. Está documentado como `it.failing` en `use-push-prompt.test.ts`; cuando se corrija, ese test pasará y Jest avisará para quitarle el `.failing`.

## Archivos clave

`features/notifications/`, `features/account/hooks/use-notification-preferences.ts`, `lib/push-prompt-storage.ts`.

## Pruebas

Fases 1, 3 y 4 completas: `push-prompt-storage`, `useUpdateNotificationPreferences`, `useNotifications`, `useNotificationPermission`, `usePushPrompt` y `useNotificationPreferences`. Limitación: la creación del canal en Android no se prueba, porque `process.env.EXPO_OS` lo reemplaza Babel por un literal al compilar y en Jest siempre vale `ios`. El caso del aviso con permiso ya concedido está marcado como `it.failing` (ver Problema conocido).
