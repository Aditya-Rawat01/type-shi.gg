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
  "time15": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time30": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time60": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "time120": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words10": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words25": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words50": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
  "words100": { rawWpm: 0, avgWpm: 0, accuracy: 0 },
};



export const careerStatsAtom = atom<careerStatsType>(defaultCareerStats);
