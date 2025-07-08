import { auth } from "@/lib/auth";
import { prisma } from "@/lib/singletonPrismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const sessionCookie = await auth.api.getSession({
        headers: req.headers,
      });
    if (!sessionCookie || !sessionCookie.user || !sessionCookie.session) {
    return NextResponse.json({
      msg: "Cookie is not valid",
    },{status: 401});
  }
  try {
    const res = await prisma.bestStats.findUnique({
        where:{
            userId: sessionCookie.session.userId
        }
    })
    console.log({asdfasdf:res})
    return NextResponse.json({
        "msg": res
    })
  } catch (error) {
    return NextResponse.json({
        "msg": "Db retreival Error"
    },{status:500})
  }
    
}