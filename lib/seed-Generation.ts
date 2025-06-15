import seedrandom from "seedrandom";
export default function generateTest({
  mode,
  time,
  wordsLen,
  wordList,
}: {
  mode: string;
  time: number | null;
  wordsLen: number | null;
  wordList: string[];
}) {
  const uuid = crypto.randomUUID();
  const rng = seedrandom(uuid);

  if (mode === "words") {
    const returnList = [];
    const wordLength = wordsLen as number;
    if (wordLength <= 0) {
      return "Error occurred, the list is not of valid size";
    }
    for (let i = 0; i < wordLength; i++) {
      const index = Math.floor(rng() * wordList.length);
      returnList.push(wordList[index]);
    }
    const characters = returnList
      .join(" ")
      .split("")
      .map((char) => ({
        char,
        status: "pending", // 'correct', 'incorrect', 'extra'
      }));
    return characters;
  }
  return [{
    char: 'a',
    status: "pending"
}];
}
