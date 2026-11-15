# Salud: vacunas y tratamientos

## Qué hace

Registra vacunas y tratamientos de una mascota y los muestra en la pestaña Salud del detalle y en la sección de tratamientos activos del resumen.

## Pantallas y rutas

| Ruta | Pantalla | Recibe |
|---|---|---|
| `/new-vaccine` | `NewVaccineScreen` | `petId` |
| `/new-treatment` | `NewTreatmentScreen` | `petId` |

Se abren desde el menú de agregar del detalle de la mascota (`/companions/[petId]`).

## Flujo

**Vacuna.** `useVaccineForm` valida con `vaccine.schema`:
- Nombre y fecha de aplicación obligatorios; la fecha no puede ser futura.
- Laboratorio y lote son opcionales pero van juntos: si se llena uno, el otro es obligatorio.

`useCreateVaccine` la envía como un tratamiento (`createTreatment`) con tipo `VACCINATION`, estado `COMPLETED`, una sola dosis y `vaccinationDetails` solo si hay laboratorio y lote.

**Tratamiento.** `useTreatmentForm` valida con `treatment.schema`: tipo, nombre, dosis y fecha de inicio obligatorios; frecuencia en horas y duración en días deben ser enteros positivos. `useCreateTreatment` lo envía con `toCreateTreatmentBody`.

En ambos casos se cierra la pantalla solo si la mutación termina bien; si falla, se muestra un toast y el formulario conserva lo escrito.

## Datos

- Consulta: `usePetTreatments(petId)`, clave `treatments.list(petId)`. Vacunas y tratamientos vienen en la misma lista y se distinguen por tipo.
- `useCreateVaccine` y `useCreateTreatment` invalidan `treatments.all`, `pets.detail(petId)` y `agenda.all`.

## Detalles a tener en cuenta

- Los tratamientos generan dosis que aparecen en la agenda, por eso se invalida `agenda.all` (ver [`agenda-and-home.md`](./agenda-and-home.md)).
- Las etiquetas de tipo y estado salen de `utils/treatment-type-keys.ts` y `utils/treatment-status-keys.ts`.

## Archivos clave

`features/health/`, `app/(app)/new-vaccine.tsx`, `app/(app)/new-treatment.tsx`.

## Pruebas

Fases 1 a 5 completas: conversores, mapas, schemas, hooks de `data/`, los formularios y los componentes `TreatmentRow`, `TreatmentList` (sin vacunas y con las terminadas al final), `ActiveTreatments` y `VaccineList` (cargando, error con reintento, vacío y orden por fecha). Faltan las pantallas (fase 6).
