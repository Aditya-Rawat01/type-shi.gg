import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns";
export async function GET(req: NextRequest) {
  const sessionCookie = await auth.api.getSession({
    headers: req.headers,
  });
  if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
    return NextResponse.json(
      {
        msg: "Cookie is not valid",
      },
      { status: 401 }
    );
  }
  try {
    const res = await prisma.test.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 365),
        },
        userId: sessionCookie.session.userId,
      },
    });
    return NextResponse.json({
      msg: "Fetched successfully",
      data: res.map(({createdAt, rawWpm, avgWpm, accuracy})=>({createdAt, rawWpm, avgWpm, accuracy})),
    });
  } catch (error) {
    return NextResponse.json({
        msg: "Error while fetching",
        data: error,
      },{ status: 401 }
    );
  }
}
