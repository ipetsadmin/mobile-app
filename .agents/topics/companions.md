# Mascotas (companions)

## Qué hace

Lista las mascotas del usuario, muestra el detalle de cada una (resumen, salud y citas), permite crearlas y editarlas con un formulario de varios pasos y muestra un carné de salud compartible. En la interfaz se llaman "compañeros".

## Pantallas y rutas

| Ruta | Pantalla |
|---|---|
| Pestaña `companions` (`(tabs)/companions`) | `CompanionsScreen`: lista y tarjeta para crear |
| `/companions/[petId]` | `CompanionDetailScreen`: encabezado, pestañas Resumen, Salud y Citas, menú para agregar |
| `/health-card/[petId]` | `HealthCardScreen`: carné de salud, con botón de compartir |
| `/new-companion/*` | Alta paso a paso (grupo con layout propio) |
| `/edit-companion/[petId]/*` | Edición con los mismos pasos |

Pasos del formulario, en este orden: tipo de mascota (`index`), `name`, `breed`, `sex`, `birth-date`, `time-together`, `weight`, `neutered`, `microchip` y `photo`.

## Flujo de alta

1. `CompanionFormProvider` (en el layout de `new-companion`) crea un único formulario de `react-hook-form` que comparten todos los pasos. Valores iniciales: sin nombre, nacimiento exacto hoy, "juntos desde el nacimiento", peso vacío en kg, sin castrar y sin microchip.
2. Cada paso usa `useCompanionStep`: al pulsar siguiente valida solo los campos de ese paso. Si falla, queda validando en vivo esos campos.
3. El último paso (`photo`) usa `useSaveCompanion`:
   - Crea la mascota con `useCreatePet` y, si hay foto local, la sube con `useUploadPetPhoto`.
   - Si ya se creó pero la foto falló, reintentar no crea otra mascota: reutiliza la creada y vuelve a subir la foto.
4. Al terminar, `useCloseFlow` cierra el grupo de rutas completo.

## Flujo de edición

`EditCompanionGate` carga la mascota con `usePet` y solo entonces monta el formulario con sus valores (`toCompanionValues`). Mientras carga o si falla, muestra un estado con botón de cerrar y reintentar. El guardado usa `useUpdatePet` y, si cambió la foto, `useUploadPetPhoto`.

## Primera mascota

Si el usuario no tiene mascotas, el layout de `(app)` abre el alta automáticamente y no se puede cerrar hasta crear una (ver [`session-and-bootstrap.md`](./session-and-bootstrap.md)). Quien ya tiene mascotas puede cerrar con el botón "Cerrar".

## Datos

| Hook | Qué hace | Invalida |
|---|---|---|
| `usePets` | Lista del usuario, clave `pets.list(userId)` | — |
| `usePet` | Detalle, clave `pets.detail(petId)` | — |
| `useCreatePet` | Crea (`users.createPet`) | `pets.all`, `agenda.all` |
| `useUpdatePet` | Actualiza (`pets.update`) | `pets.all`, `agenda.all` |
| `useUploadPetPhoto` | URL prefirmada, subida y confirmación | `pets.all`, `agenda.all` |

Se invalida la agenda porque los cumpleaños salen de la fecha de nacimiento de la mascota.

## Detalles a tener en cuenta

- `useHasPets` indica si hay mascotas y si la lista ya se resolvió.
- El nacimiento tiene modo `exact` o `unsure` (`BirthDateMode`) y el tiempo juntos `sinceBirth` o `joinedLater` (`TogetherMode`); la conversión a body vive en `data/to-create-pet-body.ts` y `data/to-pet-details-body.ts`.
- Compartir el carné usa `Share.share` con un mensaje de texto, no un archivo.
- Las pestañas del detalle viven en un `PagerView`; el pull-to-refresh invalida detalle, tratamientos y citas de esa mascota.

## Archivos clave

`features/pets/`, `app/(app)/new-companion/`, `app/(app)/edit-companion/`, `app/(app)/(tabs)/companions/`, `app/(app)/health-card/`.

## Pruebas

Fase 1 completa: `parse-pet`, `companion-tab`, `not-neutered-reasons`, `to-companion-values`, `to-pet-details-body` y `to-create-pet-body`. Faltan `companion.schema` (fase 2), los hooks de `data/` (fase 3) y `useSaveCompanion` y `useCompanionStep` (fase 4).
