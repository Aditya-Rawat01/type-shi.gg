import { localStorageConfig } from '@/lib/localStorageConfig';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';


// ts interface
export interface defaultSettings {
  mode: "words" | "time";
  time: number;
  words: number;
  punctuation: boolean;
  numbers: boolean;
  language: 'English'|'English1k' | 'C' | 'C++' | 'French' | 'French1k' | 'Italian' | 'Italian1k' | 'Java' | 'Javascript' | 'Php' | 'Portuguese' | 'Portuguese1k' | 'Ruby' | 'Russian' | 'Russian1k' | 'Spanish' | 'Spanish1k' | 'Typescript'
}

// just default values.
const appDefaultConfig:defaultSettings = {
    mode: "words",     // default value.
      time: 30,
      words: 50,
      punctuation: false,
      numbers: false,
      language: 'English'
}



const rawConfigAtom  = atomWithStorage<defaultSettings>(
  localStorageConfig, // key for localStorage
  appDefaultConfig
);

// to check the validity of the localStorage key. basically to know if that has been tampered.
function isValidConfig(config:defaultSettings) {
    const languages = ['English', 'English1k', 'C', 'C++', 'French' ,'French1k','Italian','Italian1k' ,'Java','Javascript','Php','Portuguese','Portuguese1k','Ruby','Russian','Russian1k','Spanish','Spanish1k','Typescript'];
    return  (
          (config.mode == "words" || config.mode == "time") &&
          config.time > 0 &&
          config.words>0 &&
          typeof config.numbers === "boolean" &&
          typeof config.punctuation === "boolean" &&
          languages.includes(config.language)
        )
}
export const modeAtom = atom(
    // for initial mount
    (get)=> {
        const rawConfig = get(rawConfigAtom)
        return isValidConfig(rawConfig) ? rawConfig : appDefaultConfig;
    },
    // for re-renders
    (get, set, newConfig: defaultSettings| ((prev: defaultSettings) => defaultSettings)) => {
    // When the UI wants to set a new value, we just pass it
    // through to the underlying storage atom. The `onSet`
    // functionality of atomWithStorage will handle persistence.

    /// crazy thing is that the current function overwrite the setState implementation.
    /// we have to set the inside part of the setState with the help of newConfig here.
    // then we are setting the rawConfigAtom to this newConfig, if set Function is not declared then it can handle both the direct values as well
    // as the functions.
    // mode atom is acting like a derived atom, so when the rawConfig atom gets updated then modeAtom also gets updated.
    set(rawConfigAtom, newConfig);
  }
)

// Creates an atom.
// On initial load (get), it tries to read from localStorage using the key 'defaultConfigs/localStorageConfig'.
// If it finds a value, it runs JSON.parse and uses that as the atom's initial state. // automatically
// If it finds nothing, or if JSON.parse fails (it has an internal try...catch), it uses the appDefaultConfig you provided. // fallback
// It automatically subscribes to any changes to the atom (onSet). // again automatically.
// When the atom changes, it runs JSON.stringify on the new value and saves it to localStorage. // crazy good
// It handles resetting the atom back to its default value and clearing localStorage.