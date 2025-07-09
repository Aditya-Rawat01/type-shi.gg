import seedrandom from "seedrandom";
import { createHash } from "crypto";
export default function generateTest({
  mode,
  testWordlength,
  wordList,
  seed,
  punctuation,
  numbers
}: {
  mode: string;
  testWordlength: number | null;
  wordList: string[];
  seed?:string
  punctuation:boolean
  numbers:boolean
}) {
  console.log("thats what i am talking")
  if (mode === "words") {
    const uuid = crypto.randomUUID();
    const testLength = testWordlength as number;
    if (testLength <= 0 || wordList.length===0) {
      return "Error occurred, the list is not of valid size";
    }
    
    const {characters, generatedHash, originalSeed} = generateWords({wordList,uuid, mode, testLength, hasSeed:false, punctuation, numbers}) // also return the numberOf generations to know that the hash is generated only once.
      
    return {characters, generatedHash, originalSeed};
  } else {
    // for time based test.
    let uuid = seed
    if (typeof uuid !=="string") {
      uuid = crypto.randomUUID();
    }
    const {characters, generatedHash, originalSeed} = generateWords({wordList, uuid, mode, testLength:null, hasSeed: seed?true:false, punctuation, numbers})
    return {characters, generatedHash, originalSeed};
   
}
}


function generateWords({uuid, wordList,mode, testLength, hasSeed, punctuation, numbers}:{uuid:string, wordList:string[],mode:string, testLength:number|null, hasSeed:boolean, punctuation:boolean, numbers:boolean}) {
  const rng = seedrandom(uuid);
  const returnList = [];
  const punctuationArr = [".",",",":","!","?",";","-","~"]
  const endValue = mode === "words" ? testLength! : 100
  const hash = createHash('sha256') 
  for (let i = 0; i < endValue; i++) {
      const index = Math.floor(rng() * wordList.length);
      let originalWord = wordList[index].toLowerCase()
      if (rng()<0.2 && punctuation) {
        originalWord = originalWord+punctuationArr[Math.floor(rng()*punctuationArr.length)]
      }
      if (rng()<0.1 && numbers) {
        const randomNumber = Math.floor(rng() * 300); // takes about 0 to 999
        originalWord = originalWord+randomNumber.toString()
      }
      returnList.push(originalWord);}

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

