import { atom } from "jotai";

export type LastYearResult = {
    createdAt: Date;
    accuracy: number;
    avgWpm: number;
    rawWpm: number;
}[]
export const lastYearResultAtom = atom<LastYearResult>([])