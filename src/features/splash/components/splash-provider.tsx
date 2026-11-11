import { createContext, useState, type PropsWithChildren } from 'react';

type SplashContextValue = {
  isFinished: boolean;
  finish: () => void;
};

export const SplashContext = createContext<SplashContextValue>({
  isFinished: true,
  finish: () => {},
});

export function SplashProvider({ children }: PropsWithChildren) {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <SplashContext value={{ isFinished, finish: () => setIsFinished(true) }}>
      {children}
    </SplashContext>
  );
}
