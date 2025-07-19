import { z } from "zod";
import tinycolor from "tinycolor2";
import { themeStorageConfig } from "@/lib/localStorageConfig";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// ts interface
export interface defaultTheme {
  background: string;
  backgroundSecondary: string;
  primary: string;
  secondary: string;
  text: string;
  destructive: string;
}

// just default values.
const appDefaultConfig: defaultTheme = {
  background: "#FFF287",
  backgroundSecondary: "#C83F12",
  primary: "#00ff44",
  secondary: "#99a1af",
  text: "#3B060A",
  destructive: "#DC3C22",
};

const rawConfigAtom = atomWithStorage<defaultTheme>(
  themeStorageConfig, // key for localStorage
  appDefaultConfig
);

// to check the validity of the localStorage key. basically to know if that has been tampered.

const zColorString = z.string().refine((value) => tinycolor(value).isValid());

const themeSchema = z.object({
  background: zColorString,
  backgroundSecondary: zColorString,
  primary: zColorString,
  secondary: zColorString,
  text: zColorString,
  destructive: zColorString,
});

// checks for valid theme obj
export function isValidTheme(input: unknown): input is defaultTheme {
  const validationResult = themeSchema.safeParse(input);
  return validationResult.success;
}

export const themeAtom = atom(
  (get) => {
    const rawConfig = get(rawConfigAtom);
    if (isValidTheme(rawConfig)) {
      return rawConfig;
    }
    return appDefaultConfig;
  },
  (
    get,
    set,
    newConfig: defaultTheme | ((prev: defaultTheme) => defaultTheme)
  ) => {
    set(rawConfigAtom, newConfig);
  }
);
