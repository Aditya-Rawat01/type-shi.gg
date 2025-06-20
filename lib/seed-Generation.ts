import seedrandom from "seedrandom";
export default function generateTest({
  mode,
  testWordlength,
  wordList,
  hasSeed
}: {
  mode: string;
  testWordlength: number | null;
  wordList: string[];
  hasSeed?:string
}) {
  if (mode === "words") {
    const uuid = crypto.randomUUID();
    const wordLength = testWordlength as number;
    if (wordLength <= 0) {
      return "Error occurred, the list is not of valid size";
    }
    
    const characters = generateWords({wordList,uuid, mode, hasSeed:false}) // also return the numberOf generations to know that the hash is generated only once.
      
    return characters;
  } else {
    console.log("thats what i am talking")
    if (typeof hasSeed==="string") {
      
      const characters = generateWords({wordList, uuid:hasSeed, mode, hasSeed: true})
      return characters;
    }

     else {
      const uuid = crypto.randomUUID();

      const characters = generateWords({wordList, uuid, mode, hasSeed:false})
      return characters;
    }
}
}


function generateWords({uuid, wordList,mode, hasSeed}:{uuid:string, wordList:string[],mode:string, hasSeed:boolean}) {
  const rng = seedrandom(uuid);
  const returnList = (mode==="time" && hasSeed)?[""]:[];

  for (let i = 0; i < 30; i++) {
      const index = Math.floor(rng() * wordList.length);
      returnList.push(wordList[index]);}

      const characters = returnList // also return the numberOf generations to know that the hash is generated only once.
      .join(" ")
      .split("")
      .map((char) => ({
        char,
        status: "pending", // 'correct', 'incorrect', 'extra'
      }));
    
      return characters
}

