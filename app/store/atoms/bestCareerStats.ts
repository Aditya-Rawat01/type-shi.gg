import { localStorageConfig } from "@/lib/localStorageConfig";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type careerStatsType = {
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

const rawCareerStatsAtom = atomWithStorage<careerStatsType>(
  localStorageConfig,
  defaultCareerStats
);
function isValidStats(stat: careerStatsType) {
  for (const value of Object.values(stat)) {
    if (value.accuracy < 0 || value.rawWpm < 0 || value.avgWpm < 0) {
      return false;
    }
  }
  return true;
}

export const careerStatsAtom = atom(
  (get) => {
    const rawCareerStats = get(rawCareerStatsAtom);
    return isValidStats(rawCareerStats) ? rawCareerStats : defaultCareerStats;
  },

  (
    get,
    set,
    newConfig: careerStatsType | ((prev: careerStatsType) => careerStatsType)
  ) => {
    set(rawCareerStatsAtom, newConfig);
  }
);
