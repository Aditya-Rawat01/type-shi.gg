"use client";

import { Provider } from 'jotai';
import { ReactNode } from 'react';

// You can use the Jotai DevTools to inspect your atoms
// import { DevTools } from 'jotai-devtools';

export default function JotaiProvider({ children }: { children: ReactNode }) {
  return (
    <Provider>
      {/* <DevTools /> Uncomment this to use the devtools */}
      {children}
    </Provider>
  );
}