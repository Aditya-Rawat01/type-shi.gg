import { localStorageConfig } from "@/lib/localStorageConfig";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type careerStatsType = {
  [key:string]:{
    rawWpm:number;
    avgWpm:number;
    accuracy:number;
  }
};

const defaultCareerStats: careerStatsType = {
  "time 15": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time 30": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time 60": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time 120": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words 10": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words 25": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words 50": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words 100": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
};



export const careerStatsAtom = atom<careerStatsType>(defaultCareerStats);
