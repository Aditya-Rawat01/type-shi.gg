import { atom } from "jotai";

export const cumulativeIntervalAtom = atom<
    { wpm: number; rawWpm: number; interval: number; errors: number,problematicKeys: string[]; }[]>([])