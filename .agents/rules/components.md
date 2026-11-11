# Componentes

Cómo escribir un componente, sea compartido (`src/components/`) o propio de una feature (`src/features/{dominio}/components/`). Naming y exports generales en [`code-style.md`](./code-style.md); estilos en [`styling.md`](./styling.md); ejemplo completo en [`templates/component.md`](./templates/component.md).

## Forma base

```tsx
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type PetSummaryProps = {
  name: string;
  breed: string;
};

export function PetSummary({ name, breed }: PetSummaryProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="heading">{name}</ThemedText>
      <ThemedText type="bodySmall" themeColor="textSecondary">
        {breed}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing['2xs'],
  },
});
```

- Declaración con `function` y export nombrado.
- Props en un `type {Componente}Props` declarado encima del componente.
- Props desestructuradas en la firma, con valores por defecto ahí mismo.
- Un componente por archivo. Un subcomponente, por pequeño que sea, va en su propio archivo.
- Sin `React.FC`, sin `memo`, `useMemo` ni `useCallback`: el proyecto usa React Compiler.
- El `StyleSheet` va al final del archivo.

## Antes de crear un componente

Busca en este orden y usa lo primero que sirva:

1. `src/components/` y `components/` de la feature: puede que ya exista.
2. `@expo/ui`: sheets, pickers, sliders, switches, menús y secciones de formulario nativos. Se prefiere sobre un control hecho a mano o una librería de terceros.
3. Componentes de React Native y módulos de Expo (`expo-image`, `expo-symbols`, `expo-glass-effect`).

Solo si nada de eso alcanza se crea un componente nuevo.

## Compartido o privado

Un componente nace dentro de la feature que lo necesita. Sube a `src/components/` cuando se cumplen las tres condiciones:

1. Lo usan dos o más features.
2. Tiene un rol con nombre propio (`Card`, `EmptyState`, `Badge`).
3. Su API es más pequeña que su implementación.

No se crea un componente compartido "por si acaso".

## Presentacional y contenedor

- `src/components/` es presentacional: datos y callbacks por props. No usa React Query, no importa de `@/features` y no conoce tipos de dominio.
- La pantalla es el contenedor: llama a los hooks de la feature y pasa resultados a los componentes.
- Los componentes de una feature reciben datos ya resueltos. Pueden usar tipos de `@ipetsadmin/contracts` en sus props.
- La lógica vive en hooks. El componente decide qué mostrar según el estado que el hook le entrega.

## Contrato de un componente compartido

Todo componente interactivo de `src/components/` define:

- **`variant`**: intención visual (`primary`, `secondary`). Se agrega una variante solo cuando una pantalla real la necesita.
- **`size`**: `sm`, `md`, `lg`, con `md` por defecto. Cada tamaño usa tokens del tema.
- **Estados**: presionado, deshabilitado y cargando. Todo elemento tocable da respuesta visual al presionarlo.
- **`style`**: se fusiona al final para que quien lo usa ajuste layout (márgenes, flex). No se usa para cambiar colores; si hace falta, falta una variante.
- **Accesibilidad**: `accessibilityRole`, `accessibilityState` y, si no hay texto visible, `accessibilityLabel`.

Cuando las props empiezan a describir contenido (`leftIcon`, `subtitle`, `footerText`), el componente pasa a recibir `children`.

## Controles y librerías

- Listas largas o de tamaño desconocido: `FlatList`. El `List` de `@expo/ui` es para filas agrupadas tipo ajustes, no virtualiza.
- Imágenes: `Image` de `expo-image`.
- Íconos del sistema: `expo-symbols` en iOS con su equivalente Material en Android. Los íconos propios de Truffa están en `assets/icons/`.
- Áreas seguras: `react-native-safe-area-context` o `contentInsetAdjustmentBehavior="automatic"` en el `ScrollView`.
- Texto: siempre `ThemedText`. No se usa `Text` de React Native directamente en pantallas.

## Qué no hacer

- No usar `useEffect` para derivar estado que se puede calcular en el render.
- No hacer fetch ni usar `useQuery`/`useMutation` dentro de un componente.
- No importar `expo-router` fuera de `src/app/`. La navegación llega por callbacks.
- No envolver un control nativo solo para pasarlo por el sistema de diseño.
- No usar elementos del DOM (`div`, `img`, `span`).
- No dejar un control visible sin comportamiento: un botón sin acción no se entrega.
