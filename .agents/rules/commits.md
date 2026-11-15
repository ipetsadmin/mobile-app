# Commits

## Cuándo

No hagas commit ni push a menos que el usuario lo pida. Deja el cambio listo y avisa que está para revisión.

## Hooks

Husky corre dos hooks en cada commit:

- **`pre-commit`**: Biome sobre los archivos del commit (`lint-staged`), `tsc --noEmit`, `expo lint` y `jest --ci`, en ese orden. Si un paso falla, el commit se cancela y se muestra qué comando corre para reproducirlo.
- **`commit-msg`**: `commitlint` valida el formato del mensaje.

Si un paso falla, se arregla antes de volver a commitear. Los hooks se instalan solos con `npm install` (script `prepare`).

## Formato

```
<type>(<scope opcional>): <subject>
```

- **`type`**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci` o `revert`.
- **`scope`**: opcional, en kebab-case (commitlint lo exige). La pantalla, el dominio o la carpeta que se tocó (`sign-in`, `pet`, `theme`).
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
- No saltarse los hooks con `--no-verify` ni `git push --force` salvo pedido explícito.
- No commitear `ios/`, `android/`, `.expo/`, archivos `.env` ni credenciales.

## Ramas

Se parte de `main`. Nombres: `feature/<slug-kebab>` y `fix/<slug-kebab>`.
