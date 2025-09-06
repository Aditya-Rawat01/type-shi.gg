import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk"
import { auth } from "@/lib/auth";
import test, { flameGraph as zodGraph } from "@/lib/zodSchema";

const SYSTEM_PROMPT = `
You are an expert typing coach. Your persona is direct, encouraging, and focused.

**CRITICAL AND MOST IMPORTANT!!! RULE: You are speaking ***DIRECTLY*** to the student. Use "you" and "your". ***NEVER*** use third-person phrases like "the test taker" or "the user".**
*   ***Good Example:*** "Your accuracy was impressive."
*   ***Bad Example:*** "The test taker's accuracy was impressive."

**Your Analysis Goal:**
Focus entirely on the final, overall results (final average WPM, total errors, and total problematic keys). Do not mention specific interval numbers or trends (e.g., "in interval 3" or "in the last few seconds"). Your feedback should reflect the complete performance, not the journey.

**Speed Tiers:**
*   Average: ~60 WPM
*   Good: 75+ WPM
*   Great: 85+ WPM
*   Exceptional: 100+ WPM

**Output Rules:**
1.  Adhere to the exact structure below.
2.  Keep the total response between 50 and 150 words.
3.  Be concise and impactful.

---
Note: *Important!* Avoid any "*" or "**" in your replies!
**STRUCTURED OUTPUT:**
Note: **Follow the exact output structure Important!**
Verdict: [Few punchy words summarizing the key takeaway. Start with "You..."]\n
Summary: [Explain the verdict using the final average WPM and total errors as evidence. Relate speed to the tiers above.]\n
Improvements: [Give 1-2 highly specific and actionable commands for what to practice. If there are problematic keys, create a direct exercise for them.]
`;

function buildPrompt({stats, rawWpm:finalRawWpm, avgWpm:finalAvgWpm, accuracy:finalAccuracy}
  :{stats: object, rawWpm:number, avgWpm:number, accuracy:number}): string {
  return `Here are the user's stats:\n${JSON.stringify({stats,finalAvgWpm,finalRawWpm, finalAccuracy}, null, 2)}\n\nGenerate insightful feedback.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { msg: "Missing GROQ API Key" },
      { status: 500 }
    );
  }
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  const sessionCookie = await auth.api.getSession({
              headers:req.headers
          })
          if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
              return NextResponse.json({
                  "msg": "Cookie is not valid"
              }, {status:401})
          }

          const {flameGraph, rawWpm, avgWpm, accuracy} = await req.json();
          const stats = zodGraph.safeParse(flameGraph)
          if (!stats.success) {
            return NextResponse.json({
              "msg":stats.error
            }, {status:401})
          }
          if (typeof rawWpm!='number' || typeof avgWpm!='number' || typeof accuracy!='number') {
            return NextResponse.json({
              "msg":"Invalid entries, Some of the fields are not of desired type"
            }, {status:401})
          }
    // give the type declaration so that it understand what type the data is.
    // create the frontend api endpoint as well and give a loading state till this generates.
    // allow only one summary per test.
    try {
      const chatCompletion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildPrompt({stats, rawWpm, accuracy, avgWpm}) },
    ],
  });
  console.log(chatCompletion)
  return NextResponse.json({
    result: chatCompletion.choices[0].message.content,
  });
    } catch (error) {
     console.log(error)
      return NextResponse.json({
        "msg":"Free tier got exhausted"
      },{status:429})
    }
  
}
