import seedrandom from "seedrandom";
import { createHash } from "crypto";
export default function generateTest({
  mode,
  testWordlength,
  wordList,
  seed
}: {
  mode: string;
  testWordlength: number | null;
  wordList: string[];
  seed?:string
}) {
  console.log("thats what i am talking")
  if (mode === "words") {
    const uuid = crypto.randomUUID();
    const testLength = testWordlength as number;
    if (testLength <= 0 || wordList.length===0) {
      return "Error occurred, the list is not of valid size";
    }
    
    const {characters, generatedHash, originalSeed} = generateWords({wordList,uuid, mode, testLength, hasSeed:false}) // also return the numberOf generations to know that the hash is generated only once.
      
    return {characters, generatedHash, originalSeed};
  } else {
    // for time based test.
    let uuid = seed
    if (typeof uuid !=="string") {
      uuid = crypto.randomUUID();
    }
    const {characters, generatedHash, originalSeed} = generateWords({wordList, uuid, mode, testLength:null, hasSeed: seed?true:false})
    return {characters, generatedHash, originalSeed};
   
}
}


function generateWords({uuid, wordList,mode, testLength, hasSeed}:{uuid:string, wordList:string[],mode:string, testLength:number|null, hasSeed:boolean}) {
  const rng = seedrandom(uuid);
  const returnList = [];
  const endValue = mode === "words" ? testLength! : 100
  const hash = createHash('sha256') 
  for (let i = 0; i < endValue; i++) {
      const index = Math.floor(rng() * wordList.length);
      returnList.push(wordList[index]);}

      const intermediateString  = returnList // also return the numberOf generations to know that the hash is generated only once.
      .join(" ");

      const finalString=(mode==="time")?intermediateString+" ":intermediateString

      const generatedHash = hash.update(finalString,'utf-8').digest('hex')
      
      const characters = finalString.split("")
      .map((char) => ({
        char,
        status: "pending", // 'correct', 'incorrect', 'extra'
      }));
      // console.log({finalString})
      // console.log({uuid, generatedHash})
      return {characters, generatedHash, originalSeed: !hasSeed?uuid:null}
}

