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
- La fecha actual se inyecta o se fija; un test nunca depende de la hora real.
- Solo se mockea la frontera: `apiClient`, `expo-secure-store`, `expo-router`, `AsyncStorage`. La lógica propia no se mockea.
- Un test que falla no se borra ni se salta (`it.skip`) para poder commitear.
- Los tests siguen el formato de Biome como cualquier otro archivo.
- El huso horario de las pruebas es UTC (`src/test/global-setup.js`); un test de fechas no depende de la máquina.

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
