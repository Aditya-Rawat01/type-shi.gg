import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import test, { TestPayload } from "@/lib/zodSchema";
import { createHash } from "crypto";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import seedrandom from "seedrandom";
import English from "@/languages/English.json";
import English1k from "@/languages/English1k.json";
export async function POST(req: NextRequest) {
  const { token }: { token: string | undefined | null } = await req.json();
  const sessionCookie = await auth.api.getSession({
    headers: req.headers,
  });
  if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
    return NextResponse.json({
      msg: "Cookie is not valid",
    });
  }
  if (!token) {
    return NextResponse.json(
      {
        msg: "No token found",
      },
      { status: 401 }
    );
  }
  const secret = new TextEncoder().encode(process.env.JWTSECRETKEY as string);
  console.log(process.env.JWTSECRETKEY);
  console.log(token);
  try {
    const { payload }: { payload: TestPayload } = await jwtVerify(
      token,
      secret,
      {
        algorithms: ["HS256"],
        clockTolerance: "3s",
      }
    );
    if (!test.safeParse(payload).success)
      return NextResponse.json(
        { ok: false, reason: "Tampered body!" },
        { status: 400 }
      );

    const {
      mode,
      mode2,
      language,
      charSets,
      flameGraph,
      accuracy,
      rawWpm,
      avgWpm,
      isPb,
    } = payload; // not removing the finalHas, generatedAmt etc as the difference in size will be redundant
    // no need of checking the data again.
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

    if (isPb) {
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
            [storedMode]: stats,
            ...body,
          }, // if none, create
          update: { [storedMode]: stats },
        });
      }
    }
    return NextResponse.json({
      msg: "Saved the test successfully.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { ok: false, reason: "invalid token" },
      { status: 400 }
    );
  }
}
