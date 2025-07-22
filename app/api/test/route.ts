import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import test, { TestPayload } from "@/lib/zodSchema";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import seedrandom from "seedrandom";
import C from "@/languages/C.json"
import CPP from "@/languages/C++.json"
import English from "@/languages/English.json";
import English1k from "@/languages/English1k.json";
import French from "@/languages/French.json";
import French1k from "@/languages/French1k.json";
import Italian from "@/languages/Italian.json";
import Italian1k from "@/languages/Italian1k.json";
import Java from "@/languages/Java.json";
import JavaScript from "@/languages/Javascript.json";
import Php from "@/languages/Php.json";
import Portuguese from "@/languages/Portuguese.json";
import Portuguese1k from "@/languages/Portuguese1k.json";
import Ruby from "@/languages/Ruby.json";
import Russian from "@/languages/Russian.json";
import Russian1k from "@/languages/Russian1k.json";
import Spanish from "@/languages/Spanish.json";
import Spanish1k from "@/languages/Spanish1k.json";
import Typescript from "@/languages/Typescript.json";
import { createHash } from "crypto";
import { findMeanAndDeviation } from "@/lib/findMeanAndDeviation";


export async function POST(req: NextRequest) {
  const sessionCookie = await auth.api.getSession({
    headers: req.headers,
  });
  if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
    return NextResponse.json({
      msg: "Cookie is not valid",
    }, {status: 401});
  }

  const body: TestPayload = await req.json();
  const result = test.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        msg: result.error,
      },
      { status: 401 }
    );
  } else {
    const {
      charSets,
      mode,
      mode2,
      flameGraph,
      accuracy,
      initialSeed,
      generatedAmt,
      finalHash,
      language,
      rawWpm,
      avgWpm,
      keySpaceDuration,
      keyPressDuration,
      isPb,
      punctuation,
      numbers
    } = result.data;

    if (
      !keySpaceDuration ||
      keySpaceDuration.length < 1 ||
      !avgWpm ||
      avgWpm <= 0
    ) {
      if (avgWpm >= 0 && (!keySpaceDuration || keySpaceDuration.length < 1)) {
        return NextResponse.json(
          {
            msg: "WPM reported with no corresponding keystroke data. 🤖",
          },
          { status: 429 }
        );
      }
    } else {
      const sumOfCadenceMs = keySpaceDuration.reduce((a, b) => a + b, 0);
      const evidenceBasedTypingTimeMinutes = sumOfCadenceMs / 1000 / 60;
      const evidenceBasedCharacterCount = keySpaceDuration.length + 1;
      const evidenceBasedWordCount = evidenceBasedCharacterCount / 5;

      let evidenceWPM = 0;
      if (evidenceBasedTypingTimeMinutes > 0) {
        evidenceWPM = evidenceBasedWordCount / evidenceBasedTypingTimeMinutes;
      }
      const difference = rawWpm - evidenceWPM;
      const allowedMargin = rawWpm * 0.15; // 15% tolerance
      if (difference > allowedMargin) {
        console.log({
          difference,
          allowedMargin,
          rawWpm,
          evidenceWPM,
          evidenceBasedCharacterCount,
          evidenceBasedWordCount,
          evidenceBasedTypingTimeMinutes,
        });
        return NextResponse.json(
          {
            msg: "Reported WPM is inconsistent with keystroke timing evidence. Test rejected.",
          },
          { status: 429 }
        ); //
      }
    }
    // bot check
    const { mean: meanPress, stdDev: deviationPress } =
      findMeanAndDeviation(keyPressDuration);
    const { mean: meanSpace, stdDev: deviationSpace } =
      findMeanAndDeviation(keySpaceDuration);

    let botScore = 0;

    if (deviationSpace === 0) {
      // not possible for humans
      botScore += 10;
    } else if (deviationSpace < 8) {
      botScore += 5;
    }

    if (deviationPress < 8) {
      botScore += 2;
    }

    if (meanSpace < 60) {
      botScore += 3;
    }
    if (meanPress < 20) {
      botScore += 2;
    }
    const PAUSE_THRESHOLD = 600;
    const hasPause = keySpaceDuration.some(
      (duration) => duration > PAUSE_THRESHOLD
    );
    if (!hasPause) {
      botScore += 2;
    }
    if (botScore >= 6) {
      return NextResponse.json(
        {
          msg: "Bot 🤖 detected! Test will not be stored.",
        },
        { status: 429 }
      );
    }
    const endValue = mode === "words" ? mode2 : 100;
    let hashGenerationCount = generatedAmt;
    let seed = initialSeed;
    let JsonLang = English;
    switch (language) {
      case "English":
        JsonLang = English;
        break;
      case "C":
        JsonLang = C;
        break;
      case "C++":
        JsonLang = CPP;
        break;
      case "English1k":
        JsonLang = English1k;
        break;
      case "French":
        JsonLang = French;
        break;
      case "French1k":
        JsonLang = French1k;
        break;
      case "Italian":
        JsonLang = Italian;
        break;
      case "Italian1k":
        JsonLang = Italian1k;
        break;
      case "Java":
        JsonLang = Java;
        break;
      case "Javascript":
        JsonLang = JavaScript;
        break;
      case "Php":
        JsonLang = Php;
        break;
      case "Portuguese":
        JsonLang = Portuguese;
        break;
      case "Portuguese1k":
        JsonLang = Portuguese1k;
        break;
      case "Ruby":
        JsonLang = Ruby;
        break;
      case "Russian":
        JsonLang = Russian;
        break;
      case "Russian1k":
        JsonLang = Russian1k;
        break;
      case "Spanish":
        JsonLang = Spanish;
        break;
      case "Spanish1k":
        JsonLang = Spanish1k;
        break;
      case "Typescript":
        JsonLang = Typescript;
        break;
      default:
        break;
    }
    let finalLength = 0;
    while (hashGenerationCount != 0) {
      const list = [];
      const hash = createHash("sha256");
      const rng = seedrandom(seed);
      const punctuationArr = [".",",",":","!","?",";","-","~"]
      for (let i = 0; i < endValue; i++) {
        const index = Math.floor(rng() * JsonLang.words.length);
        let originalWord = JsonLang.words[index].toLowerCase()
                if (rng()<0.2 && punctuation) {
                  originalWord = originalWord+punctuationArr[Math.floor(rng()*punctuationArr.length)]
                }
                if (rng()<0.1 && numbers) {
                  const randomNumber = Math.floor(rng() * 1000); // takes about 0 to 999
                  originalWord = originalWord+randomNumber.toString()
                }
        list.push(JsonLang.words[index].toLowerCase());
      }
      const intermediateString = list // also return the numberOf generations to know that the hash is generated only once.
        .join(" ");

      const finalString =
        mode === "time" ? intermediateString + " " : intermediateString;
      const generatedHash = hash.update(finalString, "utf-8").digest("hex");
      hashGenerationCount--;
      seed = generatedHash;
      finalLength += finalString.split("").length;
    }
    //console.log({finalHash, seed, initialSeed, generatedAmt})
    if (seed !== finalHash) {
      return NextResponse.json(
        {
          msg: "Hash didn't match. Wordlist has been tampered.",
        },
        { status: 401 }
      );
    }
    const limit = finalLength * 0.8;
    if (
      (keyPressDuration.length < limit || keySpaceDuration.length < limit) &&
      mode === "words"
    ) {
      return NextResponse.json(
        {
          msg: "Bot 🤖 detected! Test will not be stored.",
        },
        { status: 429 }
      );
    }
    const completeMode = mode + " " + mode2;
    await prisma.test.create({
      data: {
        charSets,
        mode: completeMode,
        flameGraph,
        accuracy: parseFloat(accuracy.toFixed(2)),
        rawWpm: parseFloat(rawWpm.toFixed(2)),
        avgWpm: parseFloat(avgWpm.toFixed(2)),
        language,
        userId: sessionCookie.user.id,
      },
    });
    // was thinking of limiting the max no of tests a user can have in db but that will just make this more slow.
    if (isPb) {
      // if user set isPb to true when their pb was indeed not true then they will loose their top test score. (Intentional)!
      const stats = {
        rawWpm: Number(rawWpm.toFixed(2)),
        avgWpm: Number(avgWpm.toFixed(2)),
        accuracy: Number(accuracy.toFixed(2)),
      };
      const storedMode = mode + mode2;
      if (
        storedMode == "time15" ||
        storedMode == "time30" ||
        storedMode == "time60" ||
        storedMode == "time120" ||
        storedMode == "words10" ||
        storedMode == "words25" ||
        storedMode == "words50" ||
        storedMode == "words100"
      ) {
        const emptyStats = () => ({ accuracy: 0, rawWpm: 0, avgWpm: 0 });

        const MODES = [
          "time15",
          "time30",
          "time60",
          "time120",
          "words10",
          "words25",
          "words50",
          "words100",
        ] as const;
        const body = Object.fromEntries(
          MODES.map((m) => [m, emptyStats()])
        ) as Record<(typeof MODES)[number], typeof stats>;

        await prisma.bestStats.upsert({
          // two req in one
          where: {
            userId: sessionCookie.user.id,
          },
          create: {
            userId: sessionCookie.user.id,
            ...body,
            [storedMode]: stats,
          }, // if none, create
          update: { [storedMode]: stats },
        });
      }
    }
  }
  return NextResponse.json({
    msg: "Saved the test successfully.",
  });
}
