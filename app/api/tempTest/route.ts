import test, { TestPayload } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from 'jose';
export async function POST(req:NextRequest) {
    const body:TestPayload = await req.json()
    const result = test.safeParse(body)

    if (!result.success) {
        console.log(result.error)
        return NextResponse.json({
            "msg": result.error,
        }, {status: 401})
    } else {
        const secret = new TextEncoder().encode(process.env.JWTSECRETKEY as string)

        const token = await new SignJWT(result.data).setProtectedHeader({ alg: 'HS256' }).sign(secret);
        return NextResponse.json({
            "msg":"stored temporarily.",
            token
        })
    }
}