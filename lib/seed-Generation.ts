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
    const testLength = testWordlength as number;
    if (testLength <= 0) {
      return "Error occurred, the list is not of valid size";
    }
    
    const characters = generateWords({wordList,uuid, mode, testLength, hasSeed:false}) // also return the numberOf generations to know that the hash is generated only once.
      
    return characters;
  } else {
    // for time based test.
    console.log("thats what i am talking")
    if (typeof hasSeed==="string") {
      
      const characters = generateWords({wordList, uuid:hasSeed, mode, testLength:null, hasSeed: true})
      return characters;
    }

     else {
      const uuid = crypto.randomUUID();

      const characters = generateWords({wordList, uuid, mode, testLength:null, hasSeed:false})
      return characters;
    }
}
}


function generateWords({uuid, wordList,mode, testLength, hasSeed}:{uuid:string, wordList:string[],mode:string, testLength:number|null, hasSeed:boolean}) {
  const rng = seedrandom(uuid);
  const returnList = (mode==="time" && hasSeed)?[""]:[];
  const endValue = mode === "words" ? testLength! : 100 
  for (let i = 0; i < endValue; i++) {
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

