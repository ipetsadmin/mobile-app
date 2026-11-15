# UI compartida

## Qué hace

`src/components/` reúne la UI que usan dos o más features. Es presentacional: recibe datos y callbacks por props, lee el tema con `useTheme()` y los textos ya vienen traducidos. Las reglas de código están en [`components.md`](../rules/components.md); acá se explica qué piezas hay y cómo se combinan.

## Piezas

| Grupo | Componentes | Qué resuelven |
|---|---|---|
| Texto y acciones | `ThemedText`, `ThemedView`, `Button`, `TextButton`, `HeaderBackButton` | Texto con la tipografía y el color del tema; botones con estados cargando y deshabilitado |
| Estados | `StatusMessage`, `PlaceholderScreen`, `RecordRow` | Cargando (sin mensaje), error con acción de reintentar y filas de registro |
| Selección | `OptionCard`, `SegmentedControl`, `RadioMark` | Opciones excluyentes con rol `radio` |
| Valor de campo | `FieldValue`, `FieldControl`, `SearchInput` | La caja de un campo (foco, relleno y error) y el valor que se muestra |
| Hoja de selección | `SelectSheet` (`select-sheet/`) | Hoja inferior con búsqueda sin distinguir tildes ni mayúsculas |
| Calendario | `Calendar` (`calendar/`) | Días, meses y años con límites mínimo y máximo |
| Menú flotante | `FloatingActionMenu`, `FloatingActionItem` | Botón `+` que abre acciones; usa vidrio líquido si el sistema lo ofrece |
| Otros | `ThemedSwitch`, `AppToaster`, `BrandMark`, `CornerGlow` | Interruptor nativo, toasts con el tema, marca y fondo decorativo |

## Campos de formulario

Los campos de `components/form/` se conectan a `react-hook-form` con `useController`: reciben `control` y `name`, escriben el valor en el formulario y muestran el error del campo, cuyo mensaje es una clave de i18n que se traduce en `FieldError`.

| Campo | Valor que guarda |
|---|---|
| `TextField` | Texto. Pasa el resto de props al `TextInput`; admite contenido al final (`trailing`) y un accesorio |
| `PasswordField` | Texto, oculto por defecto con un botón para mostrarlo |
| `CodeField` | Código numérico: descarta lo que no sea dígito y lo corta a la longitud (6 por defecto) |
| `SwitchField` | `boolean`, con una leyenda distinta para activado y desactivado |
| `SegmentedField` / `OptionGroupField` | El valor de la opción elegida; el segundo admite diseños lista, cuadrícula e en línea |
| `SelectField` | El valor elegido en una `SelectSheet`; muestra el texto de la opción o el marcador |
| `DateField` | `Date`. Con `preserveTime` conserva la hora del valor anterior |
| `TimeField` | `Date`. Elige entre franjas de 30 minutos y conserva el día (o usa hoy si no había) |

`FieldShell` pone la etiqueta (con `·` al final), la pista y el error. `FormScrollView` envuelve el formulario con scroll que sube el contenido sobre el teclado.

## Calendario

`Calendar` usa `useCalendarView` (en `src/hooks/`) para navegar: se abre en el mes del valor, y el título pasa de días a meses y a años. Elegir un año baja a sus meses y elegir un mes baja a sus días. Los días, meses y años fuera de `minimumDate` y `maximumDate` se deshabilitan, y las flechas no salen del rango. La semana empieza en domingo para inglés y en lunes para el resto de idiomas.

## Detalles a tener en cuenta

- `SelectSheet` y `ThemedSwitch` usan componentes nativos de `@expo/ui`.
- Un componente sube a esta carpeta cuando una segunda feature lo necesita (ver [`architecture.md`](../rules/architecture.md)).
- Los textos de estos componentes no están escritos en el código: llegan por props o por claves de i18n.

## Archivos clave

`components/`, `components/form/`, `components/calendar/`, `components/select-sheet/`, `hooks/use-calendar-view.ts`.

## Pruebas

Fases 5 y 6 completas para esta capa (las pantallas que los usan, como los formularios, los ejercitan de punta a punta): botones, estados, selección, `FieldValue`, `SearchInput`, todos los campos de `form/`, `SelectSheet`, el calendario completo y el menú flotante. Sin prueba propia a propósito: `RadioMark`, `FieldControl`, `CornerGlow`, `BrandMark`, `ThemedView`, `AppToaster` y `ThemedSwitch` (este último se cubre a través de `SwitchField`).
