import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/singletonPrismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const cursorId = req.nextUrl.searchParams.get('cursorId'); // string | null
  const sessionCookie = await auth.api.getSession({
    headers: req.headers,
  });
  if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
    return NextResponse.json({
      msg: "Cookie is not valid",
    },{status: 401});
  }
  try {
    console.log({cursorId})
    const res = await prisma.test.findMany({
      take: cursorId ? 5 : 10, // tells if the fetching is initial fetching
       ...(cursorId && ({
        skip: 1,
        cursor: {
          id: cursorId,
        },
      })),
      where: {
        userId: sessionCookie.session.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    console.log({res})
    return NextResponse.json({
      msg: "Fetched successfully",
      data: res,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // cursor is invalid
      return NextResponse.json(
        {
          msg: "Invalid cursor Id",
          data: error,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        msg: "Error while fetching",
        data: error,
      },
      { status: 401 }
    );
  }
}
