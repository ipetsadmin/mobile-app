# Pruebas

Pruebas unitarias con `jest-expo` y `@testing-library/react-native`. Se corren con `npm test` y también en el pre-commit ([`commits.md`](./commits.md#hooks)), que bloquea el commit si alguna falla.

## Dónde viven

- El test va junto al archivo que prueba, con el mismo nombre y sufijo `.test.ts` o `.test.tsx`: `split-appointments.ts` → `split-appointments.test.ts`.
- Nunca dentro de `src/app/`: Expo Router lo tomaría como ruta.
- Los helpers compartidos de pruebas (mocks, wrappers, factories) viven en `src/test/`.
- Un archivo de test por archivo probado. Aplican las mismas reglas de [`code-style.md`](./code-style.md): sin comentarios, sin `any`, kebab-case.

## Cómo se escribe

- `describe` por unidad, `it` por comportamiento, con el nombre en inglés describiendo el resultado: `it('puts closed appointments in past')`.
- Se prueba comportamiento observable, no implementación. En componentes se consulta por texto o rol, no por estructura interna.
- Los datos de prueba salen de factories en `src/test/factories/`, tipadas con `@ipetsadmin/contracts`. No se copian objetos grandes en cada test.
- `src/test/schema-issues.ts` (`getSchemaIssues`) devuelve la ruta y el mensaje de cada error de un schema; los tests de schema comprueban esos pares y que los mensajes sean claves traducidas. Las reglas que dependen de la fecha fijan el reloj con `jest.useFakeTimers().setSystemTime(...)`.
- `src/test/translation-keys.ts` (`hasTranslationKey`) comprueba que una clave de i18n exista en todos los idiomas; los mapas de enum a clave se prueban con él.
- La fecha actual se inyecta o se fija; un test nunca depende de la hora real.
- Solo se mockea la frontera: `apiClient`, `expo-secure-store`, `expo-router`, `AsyncStorage`. La lógica propia no se mockea.
- Un test que falla no se borra ni se salta (`it.skip`) para poder commitear.
- Los tests siguen el formato de Biome como cualquier otro archivo.
- El huso horario de las pruebas es UTC (`src/test/global-setup.js`); un test de fechas no depende de la máquina.

## Hooks de datos

Los hooks de `data/` se prueban con `renderHookWithProviders` y los mocks de `src/test/mocks/`:

```ts
jest.mock("@/lib/api-client", () => jest.requireActual("@/test/mocks/api-client"))
jest.mock("@/features/auth", () => jest.requireActual("@/test/mocks/auth-feature"))
```

- `mocks/api-client.ts` expone `apiClient` con un `jest.fn` por endpoint, `getSessionCookie` (devuelve `session-cookie`) y `ok(data)` para armar una respuesta. Se resetea solo antes de cada test; cada test configura lo que necesita.
- `mocks/auth-client.ts` sustituye `@/lib/auth-client` para los hooks que llaman a `better-auth`.
- `mocks/auth-feature.ts` sustituye `@/features/auth` (solo `useAuthSession`) para no cargar las pantallas de auth. La sesión se controla con `sessionState.current` (`null` simula sin sesión) y se restaura sola después de cada test.
- Una consulta se prueba con `waitFor` sobre `result.current`; una mutación con `await act(async () => { await result.current.mutateAsync(valores) })`.
- Las invalidaciones se comprueban con `spyOnInvalidations(queryClient)` de `src/test/query-helpers.ts`, que devuelve las claves invalidadas en orden.
- Por cada mutación se prueba: el body que se envía, las claves que invalida, que no invalida si falla y, si usa la sesión, que falla sin ella sin llamar a la API.
- `src/test/setup.ts` hace que React Query notifique de forma síncrona (`notifyManager.setScheduler`); sin eso aparecen avisos de `act`.
- Un test no puede dejar `console.error` en la salida: se arregla la causa, no se silencia.

## Hooks de lógica y formularios

- Un formulario se prueba llenando campos con `fillForm(result.current.control, valores)` de `src/test/fill-form.ts` y llamando a `await result.current.submit()`, todo dentro de `act`. No se leen ni se escriben campos por detalles internos del hook.
- Por cada formulario se prueba: que no llama a la API si es inválido, el llamado con los valores escritos, el callback de éxito, el mensaje de error y que no cierra el flujo si falla.
- `src/test/mocks/toast.ts` sustituye `sonner-native`; el mensaje esperado se obtiene con `translate(clave)` de `src/test/translate.ts`, no escrito a mano.
- Los hooks de un flujo de mascotas que usan `useFormContext` se montan con `createCompanionFormWrapper()` de `src/test/companion-form-wrapper.tsx`, pasado como tercer argumento de `renderHookWithProviders`.
- `src/test/mocks/expo-notifications.ts` y `src/test/mocks/expo-image-picker.ts` sustituyen esos módulos nativos y se resetean solos.
- Un hook que importa otra feature por su `index.ts` carga sus pantallas y con ellas módulos nativos que no existen en Jest. En ese caso se mockea la frontera de la feature (`jest.mock("@/features/pets", () => ({ usePets: jest.fn() }))`) en lugar de arrastrar la capa nativa.
- El estado que vive en memoria de módulo (por ejemplo `pending-credentials`) se limpia en un `beforeEach` del archivo que lo usa.
- Una cuenta atrás con `setTimeout` encadenado se avanza un segundo por vez con `await act(async () => { await jest.advanceTimersByTimeAsync(1000) })`.
- `process.env.EXPO_OS` lo reemplaza Babel por un literal al compilar: en Jest vale siempre `ios`, así que un camino exclusivo de Android no se puede probar así.
- Un comportamiento que se sabe incorrecto se deja como `it.failing("lo que debería hacer", ...)` y se anota en el tópico del flujo. No se borra ni se cambia la aserción para que pase.

## Componentes

- Un componente se monta con `renderWithProviders(<Componente />)`, que ya incluye React Query, i18n en español y `SafeAreaProvider` con medidas fijas. Los campos de formulario se montan con `renderWithForm(valoresIniciales, (control) => <TextField control={control} name="..." />)` de `src/test/render-with-form.tsx`, que devuelve `form()` para leer o forzar valores y errores.
- Se consulta como lo haría el usuario: `getByRole("button", { name })`, `getByLabelText`, `getByText`. Los estados se comprueban con `toBeSelected()`, `toBeDisabled()`, `toBeBusy()` y `toBeExpanded()`.
- `@testing-library/react-native` 14: `render`, `renderHook` y `fireEvent` son asíncronos (`await fireEvent.press(...)`), ya no existen los `UNSAFE_*` y `getByRole` solo encuentra elementos accesibles (un `View` con `accessibilityRole="radiogroup"` se busca por `getByLabelText`). El matcher es `toHaveAccessibilityValue`.
- Los módulos nativos están mockeados en `src/test/setup.ts`: `@expo/ui` (`mocks/expo-ui.tsx`: un `Switch` pulsable y un `BottomSheet` que solo muestra su contenido si `isPresented`, con un botón `dismiss-sheet`), `react-native-reanimated`, `react-native-worklets` y `react-native-keyboard-controller` con los mocks oficiales de cada librería. Un mock de Reanimated hecho a mano rompe: usar siempre el de la librería.
- Una `FlatList` solo monta las primeras filas en Jest. No se comprueba cuántas hay en total; se busca la fila por su nombre entre las primeras o se prueba la lista de datos en su util.
- Un componente que solo pinta estilos (por ejemplo `RadioMark`, `FieldControl`, `CornerGlow`, `BrandMark`) no tiene test propio: se cubre a través del componente que lo usa. No se prueban valores de estilo.
- Los componentes de animación de Reanimated (el splash) no se prueban, salvo el contenedor `SplashOverlay`, que se comprueba que muestra la marca y las tres frases y que no pinta nada fuera del provider.
- `sonner-native` y `@/lib/auth-client` están mockeados globalmente en `src/test/setup.ts`: ninguno de los dos puede cargarse en Jest (ESM y módulo nativo) y los `index.ts` de las features los arrastran. No hace falta `jest.mock` para ellos en cada test; los tests de los hooks de auth siguen configurando `authClient` con `@/test/mocks/auth-client`.
- Un componente que usa un hook de datos se prueba con `@/lib/api-client` mockeado (`jest.mock("@/lib/api-client", ...)`) y sus cuatro estados: cargando, error con reintento que vuelve a pedir los datos, vacío y contenido.
- Para una fecha fija se usa `jest.useFakeTimers().setSystemTime(...)`; si el componente carga datos con React Query se deja fuera de los timers falsos lo asíncrono (`doNotFake`).

## Pantallas

- Una pantalla se prueba como un usuario: se escribe en los campos por su etiqueta (`fireEvent.changeText(screen.getByLabelText(...), valor)`), se pulsa el botón por su nombre y se comprueba el efecto en la frontera: la llamada a `apiClient` o `authClient`, el callback de la ruta y el mensaje que ve el usuario. La navegación se comprueba con los callbacks que recibe la pantalla, nunca con `expo-router`.
- Por cada pantalla de formulario se prueba: que muestra sus campos, que un formulario inválido no llama a la API y muestra el error traducido, el camino feliz (llamada con lo escrito y callback de éxito) y el fallo (mensaje de error y el flujo no se cierra).
- Por cada pantalla que carga datos se prueban sus cuatro estados: cargando, error con un reintento que vuelve a pedir los datos, vacío y contenido.
- Los pasos del asistente de mascotas se montan con `renderInCompanionForm(<Paso onNext={...} />, pet?)` de `src/test/render-in-companion-form.tsx`. Con una mascota el formulario empieza con sus valores. Ojo: el `refine` de objeto de `companion.schema` solo se evalúa si el resto de campos es válido, así que un paso que depende de esas reglas (por ejemplo, el motivo de no castración) se prueba con una mascota completa y no con el formulario vacío.
- Las alertas nativas (`Alert.alert`) se espían con `jest.spyOn(Alert, "alert")` y se pulsa el botón elegido con `await act(async () => { await boton.onPress?.() })`.
- Cuando un nombre accesible aparece en dos botones (por ejemplo "Siguiente" en la flecha del calendario y en el botón del paso) se busca con `getAllByRole(...)`.
- `expo-notifications` y `expo-image-picker` están mockeados globalmente en `src/test/setup.ts`, y el mock de Reanimated añade `useReducedMotion` (el mock oficial no lo trae).

## Tamaño de un test

Un archivo de test no supera las 200 líneas ([`code-style.md`](./code-style.md)). Si un schema o un hook tiene tantas reglas que no cabe, se divide por grupo de reglas con el mismo prefijo: `companion.schema.test.ts` y `companion.schema.rules.test.ts`.

## Fases

Se avanza en orden. Cada fase termina con `npm test`, `npx tsc --noEmit` y `npx expo lint` en verde, y se commitea por separado.

| Fase | Qué se prueba | Herramienta | Prioridad |
|---|---|---|---|
| 0. Infraestructura | `src/test/`: setup, mocks de módulos nativos, `renderWithProviders`, factories | `jest-expo` | Primero |
| 1. Utils y lib | `src/utils/`, `utils/` de cada feature, `src/lib/api-error.ts` | `jest` | Alta |
| 2. Schemas | `schema/` de cada feature: casos válidos, inválidos y mensajes (claves de i18n) | `jest` | Alta |
| 3. Hooks de datos | `data/`: body enviado, desenvoltura de la respuesta, invalidación de caché, error | `renderHook` + `QueryClientProvider` | Alta |
| 4. Hooks de lógica | `hooks/`: formularios, flujos, acciones de sesión | `renderHook` | Media |
| 5. Componentes | `src/components/` y `components/` de features: estados, props, eventos | `render` | Media |
| 6. Pantallas | `screens/`: los cuatro estados (cargando, error, vacío, contenido) y navegación por callbacks | `render` | Media |
| 7. Rutas | `src/app/`: que cada ruta conecte pantalla y navegación | `expo-router/testing-library` | Baja |

Orden de features dentro de cada fase: `appointments`, `agenda`, `health`, `pets`, `auth`, `account`, `notifications`, `home`, `splash`.

## Fase 0: infraestructura

- `src/test/setup.ts` registrado en `setupFilesAfterEnv`, con los mocks globales de `expo-secure-store`, `@react-native-async-storage/async-storage`, `expo-router` y `react-native-reanimated`.
- `src/test/render-with-providers.tsx`: `QueryClientProvider` con `retry: false` e i18n inicializado en español.
- `src/test/factories/`: `make-appointment.ts`, `make-pet.ts` y siguientes, uno por modelo.
- Cobertura: `collectCoverageFrom` sobre `src/**` excluyendo `src/app`, `src/constants` y los JSON de i18n.

## Fase 7: rutas

`expo-router/testing-library` en SDK 57 solo funciona con `@testing-library/react-native` 13.x y el proyecto tiene la 14. No se empieza esta fase hasta resolver esa versión o subir de SDK.

## Qué no hacer

- No probar librerías de terceros ni el cliente de `@ipetsadmin/api-client`.
- No usar snapshots como única verificación.
- No probar estilos ni valores de `theme.ts`.
- No subir un umbral de cobertura global antes de terminar la fase 3.
