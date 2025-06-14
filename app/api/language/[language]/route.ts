// to get different languages url: http://localhost:3000/language/English
import { NextRequest, NextResponse } from "next/server";
import English from "@/languages/English.json"
import English1k from "@/languages/English1k.json"
export async function GET(req:NextRequest,  { params }: { params: Promise<{ language: string }> }) {
    const {language} = await params
    if (language=="English") {
       return NextResponse.json({
        msg:English,
        language }) 
        
    } else if (language=="English1k") {
       return NextResponse.json({
        msg:English1k,
        language })  
    }
}