# Datos y sesión

Cómo se consume la API de Truffa. Reglas de carpetas en [`architecture.md`](./architecture.md); ejemplo completo en [`templates/feature.md`](./templates/feature.md).

## El cliente

La API se consume con `@ipetsadmin/api-client`, que ya expone cada endpoint como una función tipada (`apiClient.pets.getById`, `apiClient.auth.login`). Por eso este repo no tiene archivos de servicios propios: el cliente es el servicio.

- `src/lib/api-client.ts` crea la única instancia con `createApiClient` y la exporta como `apiClient`. Es el único archivo que importa funciones de `@ipetsadmin/api-client` y el único que configura el cliente HTTP.
- La URL base se lee de `process.env.EXPO_PUBLIC_API_URL`.
- La renovación del token ante un 401 se resuelve en ese archivo, no en cada hook.
- No se usa `fetch` ni otro cliente HTTP en ningún otro lugar.
- Si falta un endpoint en el cliente, se pide que se agregue al paquete. No se escribe una llamada manual para saltárselo.

## Tipos

Todos los tipos de requests, responses y modelos vienen de `@ipetsadmin/contracts`. No se redeclaran. Los tipos de body que define `@ipetsadmin/api-client` se importan de ahí con `import type`.

Las respuestas llegan envueltas en `IApiResponse<T>`. Cada hook de consulta entrega el contenido ya desenvuelto con `select`, para que la pantalla nunca vea el envoltorio.

## Un hook por integración

Los hooks de datos viven en `src/features/{dominio}/data/`. Cada archivo exporta un solo hook que envuelve una sola función del cliente.

| Tipo | Archivo | Hook |
|---|---|---|
| Consulta de lista | `use-pets.ts` | `usePets` |
| Consulta de detalle | `use-pet.ts` | `usePet` |
| Mutación | `use-create-pet.ts` | `useCreatePet` |

- No existe un hook que agrupe varias consultas o mutaciones.
- Una operación nueva es un archivo nuevo, no una función más en un hook existente.
- El hook vive en la feature dueña del dato. Otra feature que lo necesite lo importa desde el `index.ts` de esa feature; no lo duplica.

## Query keys

Todas las keys viven en `src/constants/query-keys.ts`, agrupadas por dominio como funciones que devuelven tuplas `as const`. Ningún hook escribe una key como string suelto.

## Responsabilidad de un hook de datos

Un hook de `data/` hace cuatro cosas: llamar al cliente, convertir los valores del formulario al body del endpoint cuando difieren, desenvolver la respuesta e invalidar la caché que su mutación afecta.

No hace nada de UI:

- No navega.
- No muestra alertas ni mensajes.
- No traduce textos.
- No recibe callbacks de UI por argumento.

Lo que pasa después de una mutación lo decide quien la llama, con los callbacks por llamada de React Query:

```ts
mutate(values, { onSuccess: onPetCreated });
```

Si la conversión al body supera unas pocas líneas, se extrae a una función pura en la misma carpeta (`to-create-pet-body.ts`).

## Sesión

- La sesión pertenece a la feature `auth`. El provider que la monta vive en `src/providers/`.
- `useSession()` expone la sesión actual y las acciones para iniciarla y cerrarla.
- `useAuthenticatedSession()` devuelve la sesión garantizada. Es lo que usan los hooks de datos para obtener `accessToken` y `user`; ningún hook lee el token con valores de respaldo como `?? ''`.
- La sesión guarda solo lo que devuelve la API de autenticación. No guarda datos de otros dominios.
- Cerrar sesión no navega: cambia el estado y el layout protegido redirige.
- Los tokens se guardan con `expo-secure-store`. `AsyncStorage` es solo para preferencias no sensibles, como el tema elegido.
- Un token nunca se escribe en un log, en una query key ni en un parámetro de ruta.

## Estados de una pantalla

Toda pantalla que carga datos resuelve cuatro estados: cargando, error, vacío y contenido.

- El estado vacío no se muestra mientras la primera carga sigue en curso.
- El estado de error ofrece reintentar con `refetch`.
- Un formulario no se cierra antes de que su mutación termine con éxito, y conserva lo escrito si falla.

## Qué no hacer

- No importar funciones de `@ipetsadmin/api-client` fuera de `src/lib/api-client.ts`.
- No usar `useQuery` ni `useMutation` fuera de la carpeta `data/` de una feature.
- No copiar datos del servidor a `useState`, a un contexto o a disco; la caché de React Query es la fuente.
- No atrapar un error en un hook de datos para devolver un valor por defecto.
