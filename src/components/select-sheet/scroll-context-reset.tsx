import type { Context, ReactNode } from 'react';
import { ScrollView, VirtualizedList } from 'react-native';

type ScrollContextResetProps = {
  children: ReactNode;
};

const ScrollViewContext = (ScrollView as unknown as { Context?: Context<unknown> }).Context;
const VirtualizedListContext = (VirtualizedList as unknown as { contextType?: Context<unknown> })
  .contextType;

export function ScrollContextReset({ children }: ScrollContextResetProps) {
  let content = children;

  if (ScrollViewContext) {
    content = <ScrollViewContext.Provider value={null}>{content}</ScrollViewContext.Provider>;
  }

  if (VirtualizedListContext) {
    content = (
      <VirtualizedListContext.Provider value={null}>{content}</VirtualizedListContext.Provider>
    );
  }

  return content;
}
