# Agenda e inicio

## Qué hace

La agenda reúne lo próximo del usuario en un solo listado: citas, dosis de tratamientos y cumpleaños de sus mascotas. El inicio muestra lo de la semana y la pantalla de notificaciones muestra los próximos 30 días.

## Pantallas y rutas

| Ruta | Pantalla |
|---|---|
| Pestaña `(home)` | `HomeScreen`: saludo, tarjeta de carné de salud o de primera mascota, y sección "Esta semana" |
| `/notifications` | `NotificationsScreen`: lista de la agenda a 30 días, con marca de urgencia |

El inicio abre notificaciones desde el icono de campana y desde "ver todo" o "más" de la sección de la semana.

## Flujo

**Agenda.** `useAgenda(days)` pide `users.getAgenda` solo con sesión. La respuesta se ordena por fecha (`sortAgendaItems`) y las fechas se convierten a `Date`. Hay tres tipos de ítem: `APPOINTMENT`, `TREATMENT_DOSE` y `BIRTHDAY`.

**Inicio.** `HomeScreen` usa `useAgenda(7)`. `WeekSection` muestra como máximo 5 ítems agrupados por día (`groupAgendaByDay`) con encabezados "hoy", "mañana" o la fecha, y un enlace con el resto. Sin ítems muestra un estado vacío. Si falla la carga de mascotas, ofrece reintentar.

**Primera mascota.** Si el usuario no tiene mascotas, el inicio muestra una tarjeta que invita a crear la primera. Si tiene, la tarjeta lleva al detalle de la primera mascota.

**Notificaciones.** `useNotifications` toma `useAgenda(30)` y arma por cada ítem un título, un detalle y una etiqueta de tiempo relativa. Un ítem es urgente si falta menos de 3 días.

**Texto de cada ítem.** `describeAgendaItem` produce título y detalle según el tipo, con la hora o la fecha completa (`timeOnly` en el inicio). `getAgendaItemKey` da una clave estable por ítem.

**Actualizar.** El pull-to-refresh del inicio invalida `pets.all`, `agenda.all` y `account.all`; el de notificaciones, `agenda.all`.

## Datos

- Consulta: `useAgenda(days)`, clave `agenda.list(userId, days)`.
- Cualquier mutación que cree o cambie citas, tratamientos, mascotas o fotos de mascota invalida `agenda.all`; por eso la agenda se actualiza sola al volver al inicio.

## Detalles a tener en cuenta

- El inicio pide 7 días y las notificaciones 30: son dos consultas distintas con la misma clave base.
- Una cita fuera de la ventana de 7 días no aparece en el inicio pero sí en notificaciones si está dentro de 30.
- El inicio también dispara el aviso de permiso de notificaciones (ver [`notifications.md`](./notifications.md)).

## Archivos clave

`features/agenda/`, `features/home/`, `features/notifications/data/use-notifications.ts`, `app/(app)/(tabs)/(home)/`, `app/(app)/notifications.tsx`.

## Pruebas

Fases 1, 3, 4 y 5 completas: utils de agenda, `useAgenda`, `useNotifications`, `usePullRefresh` y los componentes de `home` (`AgendaRow`, `CareRecordCard`, `Greeting` con los tres momentos del día, `HomeHeader` y `WeekSection` con el tope de cinco ítems y el enlace con el resto). `NotificationRow` también está cubierto. Faltan las pantallas `HomeScreen` y `NotificationsScreen` (fase 6).
