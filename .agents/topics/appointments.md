# Citas

## Qué hace

Permite crear citas para una mascota (veterinario, dental, peluquería, entrenamiento u otro) y listarlas, separadas entre próximas y pasadas.

## Pantallas y rutas

| Dónde | Qué |
|---|---|
| `/new-appointment` (recibe `petId`) | `NewAppointmentScreen`: formulario de creación |
| Pestaña Citas del detalle de la mascota | `AppointmentList` |

Se llega a la creación desde el menú de agregar del detalle (`/companions/[petId]`). El resumen de la mascota ya no muestra la próxima cita; esa información se ve en la pestaña Citas y en la agenda del inicio.

## Flujo de creación

1. `useAppointmentForm` valida con `appointment.schema`:
   - Tipo de cita obligatorio.
   - Fecha y hora obligatorias y futuras (`validation.mustBeFuture`).
   - Proveedor, lugar, dirección y ciudad obligatorios.
   - Motivo opcional.
2. El valor inicial de la fecha es la hora actual redondeada hacia arriba al siguiente intervalo (`roundToSlot`).
3. `useCreateAppointment` envía la cita con `toCreateAppointmentBody`: el estado inicial es `PENDING`, el propietario es el usuario de la sesión y los textos se recortan.
4. Si sale bien, la ruta vuelve atrás (`router.back()`). Si falla, toast de error y el formulario conserva lo escrito.

## Listado

`splitAppointments` separa las citas:
- **Próximas:** fecha igual o posterior a ahora y estado que no sea cancelada ni completada, ordenadas de más cercana a más lejana.
- **Pasadas:** todo lo demás, de la más reciente a la más antigua.

## Datos

- Consulta: `usePetAppointments(petId)`, clave `appointments.list(petId)`.
- `useCreateAppointment` invalida `appointments.all` y `agenda.all`, para que el listado de la mascota y la agenda del inicio se actualicen.

## Detalles a tener en cuenta

- Las etiquetas de tipo y estado vienen de `utils/appointment-type-keys.ts` y `utils/appointment-status-keys.ts`.
- La agenda del inicio pide solo los próximos 7 días: una cita más lejana no aparece ahí aunque el refetch funcione.

## Archivos clave

`features/appointments/`, `app/(app)/new-appointment.tsx`.

## Pruebas

Cubierto: `split-appointments` (`split-appointments.test.ts`). Faltan: `appointment.schema` (fase 2), `to-create-appointment-body` (fase 1) y `useCreateAppointment` (fase 3, comprobar las invalidaciones).
