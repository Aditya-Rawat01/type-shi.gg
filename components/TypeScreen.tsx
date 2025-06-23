'use client'

import TypingArea from "./typingArea";
import SelectionPanel from "./ui/selectionPanel";

export default function TypeScreen() {
    return (
        <div className="w-screen h-screen bg-[#343639]">
            <SelectionPanel/>
            <TypingArea/>
        </div>
    )
}