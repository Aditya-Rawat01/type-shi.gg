'use client';
import { themeAtom } from '@/app/store/atoms/theme';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export function ThemeCSSVariables() {
  const theme = useAtomValue(themeAtom);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // On the server or before the component has mounted on the client, render nothing.
  if (!isMounted) {
    return null;
  }
  return (
    <style>
      {`:root {
        --background: ${theme.background};
        --text: ${theme.text};
        --primary: ${theme.primary};
        --secondary: ${theme.secondary};
        --backgroundSecondary:${theme.backgroundSecondary};
        --destructive:${theme.destructive};
      }`}
    </style>
  );
}
