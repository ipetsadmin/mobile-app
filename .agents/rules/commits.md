# Commits

## Cuándo

No hagas commit ni push a menos que el usuario lo pida. Deja el cambio listo y avisa que está para revisión.

Antes de un commit, corre:

```bash
npx tsc --noEmit
npx expo lint
```

Si alguno falla, se arregla primero.

## Formato

```
<type>(<scope opcional>): <subject>
```

- **`type`**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci` o `revert`.
- **`scope`**: opcional, en kebab-case. La pantalla, el dominio o la carpeta que se tocó (`sign-in`, `pet`, `theme`).
- **`subject`**: hasta 72 caracteres, en minúscula, en imperativo y sin punto final.

```
feat(sign-in): add email and password form
fix(pet): invalidate pet list after create
chore: add iosevka charon and playwrite nz basic fonts
refactor(theme): rename theme modes to light, dark and exploratory
```

## Cuerpo

Solo si el subject no alcanza para explicar el porqué. Viñetas cortas, una por cambio relevante. No se repite el subject ni se narra archivo por archivo.

## Qué no hacer

- No mezclar cambios sin relación en un mismo commit.
- No usar `--no-verify` ni `git push --force` salvo pedido explícito.
- No commitear `ios/`, `android/`, `.expo/`, archivos `.env` ni credenciales.

## Ramas

Se parte de `main`. Nombres: `feature/<slug-kebab>` y `fix/<slug-kebab>`.
