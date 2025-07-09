// to get different languages url: http://localhost:3000/language/English
import { NextRequest, NextResponse } from "next/server";
import C from "@/languages/C.json"
import CPP from "@/languages/C++.json"
import English from "@/languages/English.json"
import English1k from "@/languages/English1k.json"
import French from "@/languages/French.json"
import French1k from "@/languages/French1k.json"
import Italian from "@/languages/Italian.json"
import Italian1k from "@/languages/Italian1k.json"
import Java from "@/languages/Java.json"
import JavaScript from "@/languages/Javascript.json"
import Php from "@/languages/Php.json"
import Portuguese from "@/languages/Portuguese.json"
import Portuguese1k from "@/languages/Portuguese1k.json"
import Ruby from "@/languages/Ruby.json"
import Russian from "@/languages/Russian.json"
import Russian1k from "@/languages/Russian1k.json"
import Spanish from "@/languages/Spanish.json"
import Spanish1k from "@/languages/Spanish1k.json"
import Typescript from "@/languages/Typescript.json"
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
          
    } else if (language=="C") {
       return NextResponse.json({
        msg:C,
        language })  
    }else if (language=="C++") {
       return NextResponse.json({
        msg:CPP,
        language })  
    }
     else if (language=="French") {
        return NextResponse.json({
        msg:French,
        language }) 
    } else if (language=="French1k") {
        return NextResponse.json({
        msg:French1k,
        language }) 
    }else if (language=="Italian") {
        return NextResponse.json({
        msg:Italian,
        language }) 
    }else if (language=="Italian1k") {
        return NextResponse.json({
        msg:Italian1k,
        language }) 
    }else if (language=="Java") {
        return NextResponse.json({
        msg:Java,
        language }) 
    }else if (language=="Javascript") {
        return NextResponse.json({
        msg:JavaScript,
        language }) 
    }else if (language=="Php") {
        return NextResponse.json({
        msg:Php,
        language }) 
    }else if (language=="Portuguese") {
        return NextResponse.json({
        msg:Portuguese,
        language }) 
    }else if (language=="Portuguese1k") {
        return NextResponse.json({
        msg:Portuguese1k,
        language }) 
    }else if (language=="Ruby") {
        return NextResponse.json({
        msg:Ruby,
        language }) 
    }else if (language=="Russian") {
        return NextResponse.json({
        msg:Russian,
        language }) 
    }else if (language=="Russian1k") {
        return NextResponse.json({
        msg:Russian1k,
        language }) 
    }else if (language=="Spanish") {
        return NextResponse.json({
        msg:Spanish,
        language }) 
    }
    else if (language=="Spanish1k") {
        return NextResponse.json({
        msg:Spanish1k,
        language }) 
    }
    else { // anything else default to ts.
        return NextResponse.json({
        msg:Typescript,
        language }) 
    }
}