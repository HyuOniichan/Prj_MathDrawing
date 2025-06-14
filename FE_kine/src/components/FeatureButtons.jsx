import React from "react";
import { AskAIButton } from "../feat/AskAIButton";
import { HistoryModifier } from "../feat/HistoryModifier";
import { DraggableFrame } from "../feat/DraggableFrame";

export function FeatureButtons() {
    return (
        <span style={{zIndex: 1002}}>
            <AskAIButton/>
            <HistoryModifier/>
        </span>
    )
}