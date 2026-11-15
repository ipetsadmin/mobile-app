# Commits

## Cuándo

No hagas commit ni push a menos que el usuario lo pida. Deja el cambio listo y avisa que está para revisión.

## Antes de commitear

Antes de proponer o hacer un commit, y siempre antes de dar el cambio por terminado:

1. **Tópicos.** Actualiza los tópicos de [`../topics/`](../topics/index.md) que el cambio afecte. No requiere aprobación del usuario: va en el mismo commit que el cambio. Se actualiza el tópico cuando cambia una pantalla o ruta, un paso de un flujo, un hook de datos, una clave de caché o su invalidación, un caso de error, o cuando cambia qué pruebas existen. Si el cambio crea un flujo o una capa nuevos, se crea su tópico y se agrega al índice. Si no afecta a ninguno, se dice.

Después sugiere al usuario estas dos cosas y espera su respuesta:

2. **Documentación.** Si el cambio altera una regla, una convención, un comando, una estructura de carpetas o el comportamiento descrito en `README.md`, `AGENTS.md` o `.agents/rules/`, propón actualizarla y di qué archivos cambiarías.
3. **Pruebas unitarias.** Si el cambio agrega o modifica lógica (utils, schemas, hooks, componentes, pantallas), propón qué pruebas agregar o ajustar, según las fases de [`testing.md`](./testing.md).

La sugerencia es concreta: qué archivos y qué casos, no una pregunta genérica. Si no hace falta ninguna de las dos, dilo y por qué.

Los tópicos se actualizan siempre. La documentación y las pruebas sugeridas no se escriben sin que el usuario las acepte, y no se hace el commit hasta que responda.

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
