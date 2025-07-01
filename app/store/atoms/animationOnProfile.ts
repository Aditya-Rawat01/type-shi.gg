import { atom } from "jotai";

export const animationOnProfileAtom = atom(false) //helps me show animation on the profile page only when the entire page is reloaded
// so no jitters bw default and dynamic values occur.