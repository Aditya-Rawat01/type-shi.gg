'use client'

import { Settings2Icon } from "lucide-react";
import { useState } from "react"
import TypingArea from "./typingArea";
import SelectionPanel from "./ui/selectionPanel";

export default function TypeScreen() {
    return (
        <div>
            <SelectionPanel/>
            <TypingArea/>
        </div>
    )
}