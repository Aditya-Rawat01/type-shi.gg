import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {seed, hash } = await req.json()
    if (!seed || !hash) {
        return NextResponse.json({
            "msg": "Invalid request. seed or hash is missing"
        })
    }
    
}