import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import test, { TestPayload } from "@/lib/zodSchema";
import { createHash } from "crypto";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import seedrandom from "seedrandom";
import English from "@/languages/English.json"
import English1k from "@/languages/English1k.json"
export async function POST(req:NextRequest) {
    const {token}:{token:string|undefined|null} = await req.json()
    const sessionCookie = await auth.api.getSession({
            headers:req.headers
        })
        if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
            return NextResponse.json({
                "msg": "Cookie is not valid"
            })
        }
    if (!token) {
        return NextResponse.json({
            "msg":"No token found"
        }, {status: 401})
    }
     const secret = new TextEncoder().encode(process.env.JWTSECRETKEY as string)
     console.log(process.env.JWTSECRETKEY)
     console.log(token)
     try {
        const {payload}:{payload:TestPayload} = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      clockTolerance: "3s",
    }) 
    if (!test.safeParse(payload).success)
    return NextResponse.json({ ok: false, reason: "Tampered body!" }, { status: 400 });

        const {mode, mode2, generatedAmt, initialSeed, language, finalHash, charSets, flameGraph, accuracy, rawWpm, avgWpm} = payload
    
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
        const intermediateString  = list.join(" ");

      const finalString=(mode==="time")?intermediateString+" ":intermediateString
        const generatedHash = hash.update(finalString,'utf-8').digest('hex')
            hashGenerationCount--
            seed=generatedHash
        }
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
                accuracy:parseFloat(accuracy.toFixed(2)),
                rawWpm:parseFloat(rawWpm.toFixed(2)),
                avgWpm:parseFloat(avgWpm.toFixed(2)),
                language,
                userId: sessionCookie.user.id
            }
        })
    return NextResponse.json({
            "msg": "Saved the test successfully."
        })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok:false, reason:"invalid token" }, { status:400 });
  }
}