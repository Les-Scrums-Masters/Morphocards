import React from "react";
import SpeakButton from "./SpeakButton";

export default function WordDisplay(props) {


    let textAlign = props.align === "center" 
                ? "text-center"
                : "text-left"


    let flexAlign = props.align === "center"
                ? "justify-center"
                : "justify-start"

    return(
        <div className={"flex flex-col " + flexAlign}>
            <p className={"text-sm text-gray-500 " + textAlign}>{props.legend}</p>
            <div className={"flex flex-row items-center gap-3 " + flexAlign}>
                <p className="text-lg text-indigo-600 font-bold">
                    {props.word}</p>
                <SpeakButton onClick={() => props.say(props.word)} />
            </div>
        </div>
    );

}