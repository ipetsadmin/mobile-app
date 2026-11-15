import type { ReactNode } from "react"
import { Pressable, View } from "react-native"

type ChildrenProps = { children?: ReactNode }

export function Host({ children }: ChildrenProps) {
  return <>{children}</>
}

export function RNHostView({ children }: ChildrenProps) {
  return <>{children}</>
}

type SwitchProps = {
  value: boolean
  onValueChange: (value: boolean) => void
}

export function Switch({ value, onValueChange }: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
    />
  )
}

type BottomSheetProps = ChildrenProps & {
  isPresented: boolean
  onDismiss: () => void
}

export function BottomSheet({
  isPresented,
  onDismiss,
  children,
}: BottomSheetProps) {
  if (!isPresented) return null

  return (
    <View testID="bottom-sheet">
      <Pressable accessibilityLabel="dismiss-sheet" onPress={onDismiss} />
      {children}
    </View>
  )
}
