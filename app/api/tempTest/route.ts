import test, { TestPayload } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from 'jose';
import { findMeanAndDeviation } from "../test/route";
import seedrandom from "seedrandom";
import English from "@/languages/English.json"
import English1k from "@/languages/English1k.json"
import { createHash } from "crypto";
export async function POST(req:NextRequest) {
    const body:TestPayload = await req.json()
    const result = test.safeParse(body)
        
    if (!result.success) {
        console.log(result.error)
        return NextResponse.json({
            "msg": result.error,
        }, {status: 401})
    } else {
        // bot check
        const keyPressDuration = result.data.keyPressDuration
        const keySpaceDuration = result.data.keySpaceDuration
        const avgWpm = result.data.avgWpm
        const rawWpm = result.data.rawWpm
        if (!keySpaceDuration || keySpaceDuration.length < 1 || !avgWpm || avgWpm <= 0) {
            if (avgWpm >= 0 && (!keySpaceDuration || keySpaceDuration.length < 1)) {
                return NextResponse.json({ 
                    "msg": "WPM reported with no corresponding keystroke data. 🤖" 
                }, { status: 429 });
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
                return NextResponse.json({ 
                    "msg": "Reported WPM is inconsistent with keystroke timing evidence. Test rejected." 
                }, { status: 429 }); //
            }
        }
        
        const {mean:meanPress, stdDev:deviationPress} = findMeanAndDeviation(keyPressDuration)
        const {mean:meanSpace, stdDev:deviationSpace} = findMeanAndDeviation(keySpaceDuration)

        let botScore = 0;

    if (deviationSpace === 0) { // not possible for humans
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
    const hasPause = keySpaceDuration.some(duration => duration > PAUSE_THRESHOLD);
    if (!hasPause) {
        botScore += 2;
    }
    if (botScore >= 6) {
        return NextResponse.json({
            "msg":"Bot 🤖 detected! Test will not be stored."
        }, {status:429})
    }

     const {mode, mode2, generatedAmt, initialSeed, language, finalHash, flameGraph} = result.data
        
            const endValue = mode==="words"?mode2:100
            let hashGenerationCount = generatedAmt
            let seed = initialSeed
            let JsonLang = English
            switch (language) {
                case "English":
                    JsonLang = English
                    break;
                case "English1k":
                    JsonLang = English1k
                    break;
                default:
                    break;
            }
            let finalLength=0
            while (hashGenerationCount!=0) {
                const list = []
                const hash = createHash('sha256')
                const rng = seedrandom(seed);
                for (let i = 0; i < endValue; i++) {
                const index = Math.floor(rng() * JsonLang.words.length);
                list.push(JsonLang.words[index]);
            }
            const intermediateString  = list.join(" ");
    
          const finalString=(mode==="time")?intermediateString+" ":intermediateString
            const generatedHash = hash.update(finalString,'utf-8').digest('hex')
                hashGenerationCount--
                seed=generatedHash
                finalLength+=finalString.split("").length
            }
            if (seed !== finalHash) {
                return NextResponse.json({
                "msg": "Hash didn't match. Wordlist has been tampered."
            }, {status: 401})
            }
            const limit=finalLength*0.8
            if ((keyPressDuration.length<limit|| keySpaceDuration.length<limit) && mode==="words") {
                return NextResponse.json({
                "msg":"Bot 🤖 detected! Test will not be stored."
            }, {status: 429})
            }
        const secret = new TextEncoder().encode(process.env.JWTSECRETKEY as string)

        const token = await new SignJWT(result.data).setProtectedHeader({ alg: 'HS256' }).sign(secret);
        return NextResponse.json({
            "msg":"stored temporarily.",
            token
        })
    }
}