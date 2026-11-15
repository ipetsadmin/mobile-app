# Orquestador de reglas

Punto de entrada de las reglas de este repo para cualquier agente de código. `AGENTS.md` en la raíz apunta acá.

Cada regla vive en un solo archivo. Si algo cambia, se edita ahí y no se repite en otro lado.

## Leer siempre

| Archivo | Qué cubre |
|---|---|
| [`architecture.md`](./architecture.md) | Features por dominio, carpetas compartidas, qué puede importar de qué y dónde va algo nuevo. |
| [`code-style.md`](./code-style.md) | Sin comentarios, tamaños máximos de archivo, TypeScript, naming, exports, imports y manejo de errores. |

## Según lo que vayas a tocar

| Vas a... | Lee | Carga la skill |
|---|---|---|
| Crear una feature o agregarle algo | [`templates/feature.md`](./templates/feature.md) | — |
| Crear una pantalla o una ruta | [`templates/screen.md`](./templates/screen.md) | `expo:expo-router` |
| Crear o editar un componente | [`components.md`](./components.md), [`templates/component.md`](./templates/component.md) | `expo:expo-ui`, `expo:expo-native-ui`, `composition-patterns` |
| Escribir estilos o tocar el tema | [`styling.md`](./styling.md) | `expo:expo-design-system` |
| Consumir la API o tocar la sesión | [`data.md`](./data.md) | `expo:expo-data-fetching` |
| Crear un formulario | [`forms.md`](./forms.md) | `react-hook-form`, `zod` |
| Agregar texto visible al usuario | [`i18n.md`](./i18n.md) | — |
| Animar algo o agregar gestos | [`styling.md`](./styling.md#animación) | `expo:expo-animation` |
| Entender cómo funciona un flujo o una capa (auth, mascotas, datos...) | [`../topics/index.md`](../topics/index.md) | — |
| Escribir o correr pruebas | [`testing.md`](./testing.md) | — |
| Hacer un commit | [`commits.md`](./commits.md) | — |

Antes de usar cualquier API de Expo, EAS o React Native, sigue lo que dice `AGENTS.md`: lee la versión de `expo` en `package.json` y consulta la documentación de esa versión.

## Completa lo que te piden

Todo cambio o funcionalidad que el usuario pida se entrega completo, no a medias.

- Cubre cada capa que el cambio toca: datos, validación, componentes, pantalla, ruta, textos en todos los idiomas y la invalidación de caché que corresponda ([receta](#receta-para-una-funcionalidad-nueva)).
- Si el cambio deja código sin uso (un componente, una clave de i18n, un export), se elimina en el mismo cambio.
- No dejes `TODO`, pantallas sin conectar ni textos sin traducir para después.
- Si algo del pedido no se puede resolver o es ambiguo, se pregunta antes de implementar, no se entrega una versión parcial sin avisar.
- El cambio termina cuando pasan `npm run biome:check`, `npx tsc --noEmit`, `npx expo lint` y `npm test`.
- Antes de tocar un flujo existente, lee su tópico en [`../topics/`](../topics/index.md) para tener el contexto.
- Antes de proponer un commit, aplica el paso de [`commits.md`](./commits.md#antes-de-commitear): actualizar los tópicos y sugerir documentación y pruebas.

## Receta para una funcionalidad nueva

1. **Feature.** Identifica a qué dominio pertenece. Si la feature no existe, créala en `src/features/{dominio}/` ([`architecture.md`](./architecture.md)).
2. **Datos.** Crea en `data/` un hook por cada endpoint que aún no tenga uno ([`data.md`](./data.md)).
3. **Validación y lógica.** Si hay formulario, crea el schema en `schema/` y su hook en `hooks/` ([`forms.md`](./forms.md)).
4. **Componentes.** Lo que solo usa este dominio va en `components/` de la feature. Lo que usarán dos o más features va en `src/components/` ([`components.md`](./components.md)).
5. **Pantalla.** Crea `screens/{nombre}-screen.tsx` y expórtala en el `index.ts` de la feature ([`templates/screen.md`](./templates/screen.md)).
6. **Ruta.** Crea el archivo en `src/app/` que renderiza la pantalla y decide la navegación.
7. **Textos.** Agrega las claves a todos los idiomas ([`i18n.md`](./i18n.md)).
8. **Verificación.** Corre `npm run biome:check`, `npx tsc --noEmit`, `npx expo lint` y `npm test`, y revisa que ningún archivo supere su tamaño máximo.

## Resumen de una línea por regla

- **Flujo**: todo pedido se entrega completo; se lee el tópico del flujo que se toca y, antes de commitear, se actualizan los tópicos y se sugiere actualizar la documentación y las pruebas unitarias.
- **Tópicos** (`../topics/`): cómo funciona cada flujo y capa de la app; se mantienen al día en cada commit.
- **`architecture.md`**: un dominio por feature, cada feature se consume por su `index.ts`, `src/app` solo tiene rutas y es el único lugar que navega.
- **`code-style.md`**: Biome formatea (comillas dobles, sin `;`), cero comentarios, límites de líneas por tipo de archivo, sin `any` ni `enum`, kebab-case, export nombrado salvo en rutas.
- **`components.md`**: un componente por archivo, `export function`, `src/components` es presentacional, control nativo de `@expo/ui` antes que uno propio.
- **`styling.md`**: `StyleSheet.create` al final del archivo, valores solo desde `@/constants/theme`, colores solo con `useTheme()`.
- **`data.md`**: `apiClient` es el único acceso a la API, un hook por integración en `data/`, tipos siempre de `@ipetsadmin/contracts`.
- **`forms.md`**: `react-hook-form` con schema de `zod`, la lógica en un hook de la feature, los mensajes de error son claves de i18n.
- **`i18n.md`**: ningún texto visible escrito en el código.
- **`testing.md`**: el test vive junto al archivo, se mockea solo la frontera, y se avanza por fases (infra, utils, schemas, hooks de datos, hooks, componentes, pantallas, rutas).
- **`commits.md`**: antes de commitear se sugiere documentación y pruebas, conventional commits validados por commitlint, hooks de husky que bloquean si falla algo, y solo cuando el usuario lo pide.

## Si una regla contradice código existente

Las reglas valen para código nuevo. Si un archivo existente no las sigue, no lo reescribas sin que te lo pidan, pero el código nuevo sí las sigue aunque el archivo vecino no lo haga.
