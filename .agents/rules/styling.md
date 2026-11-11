# Estilos

El proyecto usa los estilos nativos de React Native con un único tema de tokens en `src/constants/theme.ts`. No hay, y no se agrega, otro sistema de estilos.

## Tokens

Todo valor visual sale de `@/constants/theme`:

| Token | Uso |
|---|---|
| `Spacing` | `gap`, `padding`, `margin`. Escala `2xs` 4, `xs` 8, `sm` 12, `md` 16, `lg` 24, `xl` 32. |
| `Radius` | `borderRadius`: `control`, `card`, `device`, `pill`. |
| `Typography` | Estilos de texto. Se aplican con `ThemedText`, no directamente. |
| `Fonts` | Familias. Solo se usan dentro de `Typography`. |
| `Shadows` | `boxShadow`: `card`, `raised`, `overlay`. |
| `Motion` | Duraciones de animación: `fast`, `base`, `slow`. |
| `Themes` | Colores por tema. Se leen con `useTheme()`. |

- No se escriben números de espaciado, radios, tamaños de fuente ni colores hex fuera de `theme.ts`.
- Si un valor intermedio se repite, se agrega a la escala en `theme.ts`; no se dispersa como literal.
- Un valor que de verdad es único de un lugar (el ancho de una ilustración) puede quedar como número en el `StyleSheet`.

## Colores

Los colores dependen del tema activo y solo se obtienen con `useTheme()` dentro de un componente:

```tsx
const theme = useTheme();

<View style={[styles.card, { backgroundColor: theme.backgroundElement }]} />
```

- Se usan los nombres semánticos (`primary`, `primarySubdued`, `onPrimary`, `secondary`, `accent`, `text`, `textSecondary`, `background`, `backgroundElement`, `backgroundField`, `backgroundSelected`, `border`, `muted`, `glow`, `pattern`).
- Sobre un fondo `primary` el contenido usa `onPrimary`; lo mismo para `secondary` y `accent`.
- Nunca se lee `Themes.light` o `Themes.dark` directamente, ni se decide un color preguntando por el nombre del tema.
- `ThemedView` y `ThemedText` ya aplican fondo y color de texto; se prefieren sobre `View` y `Text` cuando hay color de por medio.
- El tema se cambia con `useThemePreference()`.

Un color nuevo se agrega a los tres temas de `Themes` a la vez, con un nombre que describa su función y no su tono.

## Dónde van los estilos

- Los estilos estáticos van en un `StyleSheet.create` al final del archivo del componente. No hay archivos `.styles.ts` separados.
- En `style` solo va lo que depende del render: colores del tema, estado presionado, valores calculados. Se combina con un arreglo: `style={[styles.base, { color: theme.text }, style]}`.
- Las variantes se definen como objetos a nivel de módulo, indexados por la prop, no con ternarios anidados en el JSX.

## Layout

- `gap` antes que márgenes; `padding` antes que `margin`.
- Flexbox para distribuir. Para medir la pantalla, `useWindowDimensions`.
- Todo radio que no sea `Radius.pill` va acompañado de `borderCurve: 'continuous'`.
- Sombras solo con `boxShadow` y los tokens de `Shadows`. No se usan `shadowColor`, `shadowOffset` ni `elevation`.
- El relleno de un `ScrollView` va en `contentContainerStyle`.
- Toda pantalla respeta las áreas seguras superior e inferior.
- El texto debe poder crecer con el tamaño de fuente del sistema: altura mínima en lugar de altura fija, y nunca `allowFontScaling={false}`.

## Tipografía

- Todo texto usa `ThemedText` con `type`: `display`, `title`, `titleSmall`, `heading`, `body`, `bodyStrong`, `bodySmall`, `button`, `label`, `navigation`, `accent`.
- No se escribe `fontSize`, `lineHeight` ni `fontFamily` en una pantalla o componente.
- No se usa `fontWeight`: las fuentes son archivos estáticos y el peso se elige con la familia en `Fonts`.
- Una fuente o peso nuevo se registra en tres lugares: `Fonts` en `theme.ts`, el plugin `expo-font` en `app.json` y `useFonts` en `src/app/_layout.tsx`.

## Animación

- Las duraciones salen de `Motion`.
- Las animaciones se hacen con `react-native-reanimated` y los gestos con `react-native-gesture-handler`.
- Los colores del tema son strings y pueden usarse en estilos animados.

## Qué no hacer

- No agregar NativeWind, Tailwind, Tamagui, styled-components ni otra librería de estilos.
- No crear archivos `.css` ni CSS Modules.
- No crear un segundo archivo de tokens junto a `theme.ts`.
- No vestir una plataforma con el lenguaje visual de la otra: sin FAB ni ripple en iOS, sin chrome de iOS dibujado a mano en Android.
