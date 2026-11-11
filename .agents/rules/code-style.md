# Estilo de código

Aplica a todo archivo `.ts` o `.tsx` que se escriba o edite, en cualquier carpeta.

## Sin comentarios

No escribas comentarios. El código se explica con nombres claros de variables, funciones, tipos y componentes.

Esto incluye:

- Comentarios que describen qué hace una línea, una función o un componente.
- Bloques `/** ... */` sobre props, tipos, hooks o funciones.
- Comentarios que narran un cambio: qué se agregó, qué había antes, por qué se movió algo.
- Separadores de sección y `// TODO`.

Si sientes que hace falta un comentario, cambia el nombre o extrae una función con un nombre que lo diga.

Únicas excepciones:

- Directivas de herramientas: `// eslint-disable-next-line ...`, `// @ts-expect-error ...`.
- Una sola línea cuando el comportamiento es contraintuitivo y alguien lo "arreglaría" mal sin la aclaración.

La explicación de un cambio va en la respuesta al usuario o en el mensaje del commit, nunca en el código.

## Tamaño de archivos

| Tipo de archivo | Máximo de líneas |
|---|---|
| Ruta en `src/app/` | 40 |
| `_layout.tsx` | 80 |
| Componente | 150 |
| Pantalla (`*-screen.tsx`) | 150 |
| Hook | 80 |
| Schema de validación | 80 |
| Archivo de `utils/` o `lib/` | 120 |
| `index.ts` de una feature | 40 |
| Cualquier otro | 200 |

El límite incluye imports, tipos y el `StyleSheet`. No aplica a `src/constants/theme.ts` ni a los JSON de traducciones.

Además:

- Una función o componente no supera las 40 líneas de cuerpo.
- Un componente no recibe más de 8 props. Si necesita más, se resuelve con composición (`children`, componentes compuestos), no con más props.
- El JSX no supera 5 niveles de anidación. Si los supera, extrae un componente.

Cuando un archivo se acerca al límite, se divide por responsabilidad: un subcomponente a su propio archivo, la lógica a un hook, una transformación a `utils/`. No se comprime el código ni se quitan saltos de línea para entrar en el límite.

## TypeScript

- `type` para props, argumentos de hooks y formas locales.
- Los tipos de dominio (mascotas, tratamientos, usuarios, sesión, requests y responses) se importan de `@ipetsadmin/contracts`. No se redeclaran ni se copian.
- Nunca `any`. Si el tipo no se puede expresar, `unknown` con narrowing explícito.
- No declares `enum`. Para un conjunto cerrado de valores, una unión de literales o un objeto `as const`. Los enums que exporta `@ipetsadmin/contracts` se usan tal cual.
- Los tipos de un formulario se derivan del schema con `z.infer`, no se escriben a mano.
- Los imports que solo traen tipos usan `import type` o `type` en línea.

## Naming

- Archivos y carpetas en kebab-case: `pet-card.tsx`, `use-pets.ts`, `format-date.ts`.
- Hooks con prefijo `use-`: `use-pets.ts` exporta `usePets`.
- Hooks de mutación con verbo: `use-create-pet.ts`, `use-delete-appointment.ts`.
- Sufijo descriptivo para archivos que no son componente ni hook: `sign-in.schema.ts`, `to-create-pet-body.ts`.
- Carpetas de feature con el nombre del dominio: `features/auth`, `features/pets`.
- Pantallas con sufijo `-screen`: `sign-in-screen.tsx` exporta `SignInScreen`.
- Props de callback con prefijo `on`: `onSelectPet`, `onSignedIn`.
- Booleanos con prefijo `is`, `has` o `should`.

## Exports

- Todo usa export nombrado: `export function PetCard`, `export function usePets`.
- La única excepción son los archivos de `src/app/`, que requieren `export default` por Expo Router.
- Una feature se consume solo por su `index.ts`. Es el único archivo que reexporta; no hay otros barrels.

## Imports

- Entre carpetas de `src/`, siempre con el alias `@/`: `@/components/button`, `@/features/pets`.
- Dentro de una misma feature, imports relativos: `../components/pet-avatar`, `../schema/sign-in.schema`. Una feature nunca se importa a sí misma por su `index.ts`.
- Los assets se importan con `@/assets/`.
- Orden: paquetes externos, línea en blanco, imports con `@/`, línea en blanco, imports relativos.
- Los módulos de un paquete se importan por la ruta más específica que exista cuando eso evita cargar el paquete completo (`@expo-google-fonts/geom/400Regular`).

## Plataforma

- `process.env.EXPO_OS` en lugar de `Platform.OS`.
- Diferencias grandes entre plataformas van en archivos separados (`chart.tsx`, `chart.web.tsx`) con las mismas props. Siempre existe el archivo sin extensión de plataforma.
- `React.use` en lugar de `useContext`.

## Dependencias

- Se instalan con `npx expo install <paquete>`, nunca con `npm install` directo.
- Antes de agregar una librería, revisa si existe un módulo de Expo que lo resuelva.
- No se agrega una dependencia nueva sin que el usuario lo pida o lo apruebe.

## Manejo de errores

- Los hooks de datos dejan que el error se propague; no lo atrapan ni lo registran en silencio.
- Las mutaciones se manejan con `onSuccess` y `onError` de React Query, no con `try/catch` alrededor de `mutate`.
- Una pantalla que carga datos resuelve cuatro estados: cargando, error, vacío y contenido.
- Ningún `console.log` queda en el código que se entrega.
