'use client';
import { themeAtom } from '@/app/store/atoms/theme';
import { useAtomValue } from 'jotai';

export function ThemeCSSVariables() {
  const theme = useAtomValue(themeAtom);
  return (
    <style>
      {`:root {
        --background: ${theme.background};
        --text: ${theme.text};
        --surface: ${theme.surface};
        --surfaceSecondary: ${theme.surfaceSecondary};
        --backgroundSecondary:${theme.backgroundSecondary};
        --destructive:${theme.destructive};
      }`}
    </style>
  );
}
