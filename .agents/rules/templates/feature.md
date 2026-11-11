# Template: feature

Ejemplo completo de `src/features/pets/`. Reglas en [`../architecture.md`](../architecture.md) y [`../data.md`](../data.md). El detalle de una pantalla con formulario está en [`screen.md`](./screen.md).

```
src/features/pets/
├── screens/
│   ├── pets-screen.tsx
│   ├── pet-detail-screen.tsx
│   └── create-pet-screen.tsx
├── components/
│   ├── pet-list.tsx
│   ├── pet-list-item.tsx
│   ├── pet-avatar.tsx
│   ├── pets-empty.tsx
│   └── pets-error.tsx
├── data/
│   ├── use-pets.ts
│   ├── use-pet.ts
│   ├── use-create-pet.ts
│   └── to-create-pet-body.ts
├── hooks/
│   └── use-create-pet-form.ts
├── schema/
│   └── pet.schema.ts
└── index.ts
```

## `src/constants/query-keys.ts`

Una entrada por dominio. Se agrega al crear la feature.

```ts
export const queryKeys = {
  pets: {
    all: ['pets'] as const,
    list: (userId: string) => ['pets', 'list', userId] as const,
    detail: (petId: string) => ['pets', 'detail', petId] as const,
  },
};
```

## `data/use-pets.ts`

Consulta de lista. Desenvuelve `IApiResponse` con `select`.

```ts
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthenticatedSession } from '@/features/auth';
import { apiClient } from '@/lib/api-client';

export function usePets() {
  const { accessToken, user } = useAuthenticatedSession();

  return useQuery({
    queryKey: queryKeys.pets.list(user.id),
    queryFn: () => apiClient.users.getPets(accessToken, user.id),
    select: (response) => response.data ?? [],
  });
}
```

## `data/use-pet.ts`

Consulta de detalle. El identificador llega por argumento.

```ts
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthenticatedSession } from '@/features/auth';
import { apiClient } from '@/lib/api-client';

export function usePet(petId: string) {
  const { accessToken } = useAuthenticatedSession();

  return useQuery({
    queryKey: queryKeys.pets.detail(petId),
    queryFn: () => apiClient.pets.getById(accessToken, petId),
    select: (response) => response.data,
  });
}
```

## `data/use-create-pet.ts`

Mutación. Convierte los valores del formulario al body, llama al cliente e invalida la caché.

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthenticatedSession } from '@/features/auth';
import { apiClient } from '@/lib/api-client';

import type { CreatePetValues } from '../schema/pet.schema';
import { toCreatePetBody } from './to-create-pet-body';

export function useCreatePet() {
  const { accessToken, user } = useAuthenticatedSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreatePetValues) =>
      apiClient.users.createPet(accessToken, user.id, toCreatePetBody(values)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pets.all }),
  });
}
```

## `data/to-create-pet-body.ts`

Función pura que adapta lo que escribe el usuario a lo que espera el endpoint.

```ts
import type { PostUserPetRequestBody } from '@ipetsadmin/api-client';
import { PetStatus, WeightUnit } from '@ipetsadmin/contracts';

import type { CreatePetValues } from '../schema/pet.schema';

export function toCreatePetBody(values: CreatePetValues): PostUserPetRequestBody {
  return {
    ...values,
    name: values.name.trim(),
    birthDate: new Date(values.birthDate),
    weight: Number(values.weight),
    weightUnit: WeightUnit.KG,
    status: PetStatus.ACTIVE,
  };
}
```

## `screens/pets-screen.tsx`

Resuelve los cuatro estados y recibe la navegación por callbacks.

```tsx
import { PetList } from '../components/pet-list';
import { PetsEmpty } from '../components/pets-empty';
import { PetsError } from '../components/pets-error';
import { PetsLoading } from '../components/pets-loading';
import { usePets } from '../data/use-pets';

type PetsScreenProps = {
  onSelectPet: (petId: string) => void;
  onAddPet: () => void;
};

export function PetsScreen({ onSelectPet, onAddPet }: PetsScreenProps) {
  const { data: pets, isPending, isError, refetch } = usePets();

  if (isPending) return <PetsLoading />;
  if (isError) return <PetsError onRetry={refetch} />;
  if (pets.length === 0) return <PetsEmpty onAddPet={onAddPet} />;

  return <PetList pets={pets} onSelectPet={onSelectPet} />;
}
```

## `index.ts`

Única entrada a la feature. Orden: pantallas, componentes de dominio, hooks de datos, tipos.

```ts
export { CreatePetScreen } from './screens/create-pet-screen';
export { PetDetailScreen } from './screens/pet-detail-screen';
export { PetsScreen } from './screens/pets-screen';

export { PetAvatar } from './components/pet-avatar';

export { usePet } from './data/use-pet';
export { usePets } from './data/use-pets';

export type { CreatePetValues } from './schema/pet.schema';
```

Se exporta solo lo que algo externo consume. `PetList`, `useCreatePet` y `toCreatePetBody` son internos mientras nadie fuera de `pets` los necesite.

## Cómo la consume una ruta

```tsx
import { router } from 'expo-router';

import { PetsScreen } from '@/features/pets';

export default function PetsRoute() {
  return (
    <PetsScreen
      onSelectPet={(petId) => router.push(`/pets/${petId}`)}
      onAddPet={() => router.push('/pets/new')}
    />
  );
}
```

## Cómo la consume otra feature

`home` muestra un resumen de mascotas. Importa el hook y el componente de dominio desde el `index.ts`, nunca una pantalla ni un archivo interno.

```tsx
import { PetAvatar, usePets } from '@/features/pets';
```

`pets` no puede importar de `home`: la dependencia va en un solo sentido.

## Feature con estado global

Solo para estado que necesita toda la app. La sesión vive en `auth`:

```
src/features/auth/data/
├── session-context.ts
├── use-session-state.ts
├── use-session.ts
├── use-authenticated-session.ts
└── use-sign-in.ts
```

- `session-context.ts` contiene solo el `createContext`, inicializado en `null`.
- `use-session-state.ts` contiene la lógica: leer y guardar la sesión con `expo-secure-store`, iniciarla y cerrarla.
- `use-session.ts` lee el contexto con `use` y lanza un error si falta el provider.
- `use-authenticated-session.ts` devuelve la sesión garantizada y lanza un error si no hay.
- El provider vive en `src/providers/session-provider.tsx` y solo conecta `useSessionState()` con el contexto.
