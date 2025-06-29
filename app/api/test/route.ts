import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import test, { TestPayload } from "@/lib/zodSchema";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import seedrandom from "seedrandom";
import English from "@/languages/English.json"
import English1k from "@/languages/English1k.json"
import { createHash } from "crypto";
export async function POST(req:NextRequest) {
    // const {seed, hash } = await req.json()
    // if (!seed || !hash) {
    //     return NextResponse.json({
    //         "msg": "Invalid request. seed or hash is missing"
    //     })
    // }
    const sessionCookie = await auth.api.getSession({
        headers:req.headers
    })
    if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
        return NextResponse.json({
            "msg": "Cookie is not valid"
        })
    }

    const body:TestPayload = await req.json()
    const result = test.safeParse(body)

    if (!result.success) {
        return NextResponse.json({
            "msg": result.error,
        }, {status: 401})
    } else {
        const {charSets, mode, mode2 , flameGraph, accuracy, initialSeed, generatedAmt, finalHash, language, rawWpm, avgWpm} = result.data

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
        while (hashGenerationCount!=0) {
            const list = []
            const hash = createHash('sha256')
            const rng = seedrandom(seed);
            for (let i = 0; i < endValue; i++) {
            const index = Math.floor(rng() * JsonLang.words.length);
            list.push(JsonLang.words[index]);
        }
        const intermediateString  = list // also return the numberOf generations to know that the hash is generated only once.
      .join(" ");

      const finalString=(mode==="time")?intermediateString+" ":intermediateString
        const generatedHash = hash.update(finalString,'utf-8').digest('hex')
            hashGenerationCount--
            seed=generatedHash
        }
        //console.log({finalHash, seed, initialSeed, generatedAmt})
        if (seed !== finalHash) {
            return NextResponse.json({
            "msg": "Hash didn't match. Wordlist has been tampered."
        }, {status: 401})
        } 
        await prisma.test.create({
            data:{
                charSets,
                mode,
                flameGraph,
                accuracy,
                rawWpm,
                avgWpm,
                userId: sessionCookie.user.id
            }
        })
    }
    return NextResponse.json({
            "msg": "Saved the test successfully."
        })
        
}