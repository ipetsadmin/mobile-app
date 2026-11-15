# Tópicos

Documentación viva de cómo funciona cada flujo y cada capa de la app. Sirve de contexto para quien llegue al código (persona o agente) antes de tocarlo. Las **reglas** de cómo escribir código viven en [`../rules/`](../rules/orquestador.md); acá se explica **qué hace la app y por qué**.

## Flujos

| Tópico | Qué cubre |
|---|---|
| [`auth.md`](./auth.md) | Registro, verificación de correo, inicio de sesión, social, recuperar contraseña y cerrar sesión |
| [`session-and-bootstrap.md`](./session-and-bootstrap.md) | Arranque de la app, splash, sesión y protección de rutas |
| [`profile.md`](./profile.md) | Cuenta: editar perfil, foto, contraseña, idioma, apariencia y notificaciones |
| [`companions.md`](./companions.md) | Mascotas: lista, detalle, alta paso a paso, edición y carné de salud |
| [`health.md`](./health.md) | Vacunas y tratamientos |
| [`appointments.md`](./appointments.md) | Citas |
| [`agenda-and-home.md`](./agenda-and-home.md) | Agenda, pantalla de inicio y lista de notificaciones |
| [`notifications.md`](./notifications.md) | Permisos y preferencias de notificaciones push y correo |

## Capas

| Tópico | Qué cubre |
|---|---|
| [`navigation.md`](./navigation.md) | Árbol de rutas, grupos, tabs y modales |
| [`data-layer.md`](./data-layer.md) | Cliente de la API, React Query, claves e invalidaciones |
| [`i18n-and-theme.md`](./i18n-and-theme.md) | Idioma, tema y preferencias guardadas |
| [`shared-ui.md`](./shared-ui.md) | Componentes compartidos: campos de formulario, calendario, hoja de selección y menú flotante |

## Cómo se escribe un tópico

Cada tópico usa estas secciones, en este orden, y omite las que no aplican:

1. **Qué hace**: una o dos frases.
2. **Pantallas y rutas**: qué pantalla se ve y en qué ruta de `src/app/`.
3. **Flujo**: pasos en el orden en que ocurren, incluidos los casos de error.
4. **Datos**: hooks de `data/`, claves de caché y qué se invalida.
5. **Detalles a tener en cuenta**: decisiones no obvias, límites y casos borde.
6. **Archivos clave**: rutas relativas a `src/`.
7. **Pruebas**: qué está cubierto y qué falta, según las fases de [`testing.md`](../rules/testing.md).

Se describe el comportamiento real del código, no el deseado. Si algo es provisional (por ejemplo, una pantalla de relleno), se dice.

## Cuándo se actualizan

Antes de cada commit, si el cambio altera cómo funciona un flujo o una capa, se actualiza su tópico en el mismo commit. Si el cambio crea un flujo nuevo, se crea el tópico y se agrega a las tablas de arriba. La regla completa está en [`commits.md`](../rules/commits.md#antes-de-commitear).
