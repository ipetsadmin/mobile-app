# Idioma, tema y preferencias guardadas

## Qué hace

La app habla español o inglés y tiene tres temas visuales. Ambas elecciones se guardan en el dispositivo y se aplican al arrancar.

## Idioma

- `lib/i18n/index.ts` crea la instancia de `i18next` con los recursos `en` y `es` (`lib/i18n/locales/`).
- El idioma inicial es el del dispositivo (`expo-localization`) si es `en` o `es`, y `en` en cualquier otro caso. `en` es también el idioma de respaldo.
- Al arrancar, `useStoredPreferences` lee el idioma guardado en `AsyncStorage` (clave `language-preference`) y lo aplica antes de mostrar nada.
- `useLanguageSetting` (cuenta) cambia el idioma al instante y lo guarda.
- Toda cadena visible es una clave de i18n y existe en los dos idiomas (ver [`i18n.md`](../rules/i18n.md)). Los errores de validación y de la API también se traducen por clave.

## Tema

- `constants/theme.ts` define tres temas: `light`, `dark` y `exploratory`. `exploratory` usa el esquema oscuro del sistema.
- La preferencia puede ser un tema concreto o `system`, que sigue el modo claro u oscuro del dispositivo. Se guarda en `AsyncStorage` (clave `theme-preference`).
- `AppThemeProvider` calcula el tema activo, sincroniza `Appearance.setColorScheme` fuera de web y pasa los colores al tema de navegación de Expo Router.
- Los componentes leen colores con `useTheme()` y la preferencia con `useThemePreference()`. El resto de valores visuales (espaciado, radios, tipografía, sombras, movimiento) viene de `constants/theme.ts` (ver [`styling.md`](../rules/styling.md)).
- Las fuentes (Geom, Iosevka Charon, Playwrite NZ Basic) se cargan en el layout raíz.

## Qué se guarda y dónde

| Dato | Dónde | Clave |
|---|---|---|
| Tokens de sesión | `expo-secure-store` | prefijo `truffa` |
| Idioma | `AsyncStorage` | `language-preference` |
| Tema | `AsyncStorage` | `theme-preference` |
| Aviso de push respondido | `AsyncStorage` | `push-prompt-answered` |

## Archivos clave

`lib/i18n/`, `lib/language-storage.ts`, `lib/theme-storage.ts`, `hooks/use-stored-preferences.ts`, `providers/theme-provider.tsx`, `constants/theme.ts`.

## Pruebas

El idioma de las pruebas se fija en español en `src/test/render-with-providers.tsx`. Sin pruebas propias todavía; candidatos de fase 1: `language-storage` y `theme-storage` con el mock de `AsyncStorage`.
