# Formularios

Todo formulario usa `react-hook-form` con un schema de `zod` conectado por `@hookform/resolvers`. Ejemplo completo en [`templates/screen.md`](./templates/screen.md).

## Piezas de un formulario

| Pieza | Dónde vive | Qué contiene |
|---|---|---|
| Schema | `src/features/{dominio}/schema/{formulario}.schema.ts` | El schema de `zod` y el tipo inferido de sus valores. |
| Hook | `src/features/{dominio}/hooks/use-{formulario}-form.ts` | `useForm`, la mutación de `data/` y la función de envío. |
| Campos | `src/components/form/` | Controles conectados a `react-hook-form`. |
| Vista | `src/features/{dominio}/screens/` o un componente de la feature | Los campos y el botón de envío. |

## Schema

- Un schema por formulario, declarado a nivel de módulo.
- El tipo de los valores se deriva con `z.infer` y se exporta junto al schema.
- Los mensajes de error son claves de i18n (`validation.required`), no textos.
- El schema valida lo que el usuario escribe. Si el body del endpoint tiene otra forma, la conversión la hace el hook de datos.
- Un schema que usan dos formularios de la misma feature se comparte desde `schema/`. Si lo necesita otra feature, se exporta su tipo en el `index.ts`.

## Hook del formulario

- Llama a `useForm` con `zodResolver` y `defaultValues` completos.
- Usa el hook de mutación de `data/`; no llama al cliente directamente.
- Si la pantalla debe reaccionar al éxito, recibe el callback por argumento (`onPetCreated`) y lo pasa a `mutate`.
- Devuelve solo lo que la vista necesita: `control`, la función de envío y el estado (`isPending`, error).

## Campos

- Los campos de `src/components/form/` son genéricos sobre el formulario: reciben `control` y `name` tipados con `Control<T>` y `Path<T>`.
- Cada campo muestra su etiqueta, su control y su mensaje de error, y traduce la clave del error.
- Antes de crear un campo nuevo, revisa `src/components/form/` y los controles de `@expo/ui`.
- Un campo no conoce ningún formulario concreto.

## Comportamiento

- El botón de envío se deshabilita y muestra carga mientras `isPending` es verdadero.
- La acción principal nunca queda tapada por el teclado. Los formularios con scroll usan `KeyboardAwareScrollView` de `react-native-keyboard-controller`, con `bottomOffset` suficiente para que el botón de envío quede visible.
- En formularios con scroll, `keyboardShouldPersistTaps="handled"`.
- El teclado avanza al siguiente campo con `returnKeyType="next"` y envía en el último.
- Cada campo declara su tipo de teclado, autocompletado y `textContentType` cuando aplica.
- Un error del servidor se muestra en la pantalla; no se descarta.

## Qué no hacer

- No manejar campos con `useState`.
- No validar a mano dentro del componente.
- No escribir el tipo de los valores por separado del schema.
- No usar `watch` para todo el formulario; `useWatch` sobre el campo puntual.
