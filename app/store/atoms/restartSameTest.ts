import { atom } from "jotai"


export const restartSameTestAtom = atom(false)


export const shadowTestAtom = atom<{
      char: string;
      status: string;}[]>([]);

export const persistWordListAtom  = atom<string[]>([]);