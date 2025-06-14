import seedrandom from "seedrandom";
export default function generateTest({
    mode, time, words, wordList
}:
  {mode: string,
  time?: number,
  words?: number,
  wordList: string[]}
) {
  const uuid = crypto.randomUUID();
  const rng = seedrandom(uuid);

  if (mode === "words") {
    const returnList = [];
    const wordLength = words as number;
    if (wordLength<=0) {return "Error occurred, the list is not of valid size" }
    for (let i = 0; i < wordLength; i++) {
      const index = Math.floor(rng() * wordList.length);
      returnList.push(wordList[index]);
    }
    console.log(returnList)
    return returnList
  }
  return [""]
}
