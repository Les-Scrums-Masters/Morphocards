import React from "react";
import SpeakButton from "./SpeakButton";

export default function ModalWordDisplay(props) {

    return(
        <div className="mt-2">
            <p className="text-sm text-gray-500">{props.legend}</p>
            <div className="speakable">
                <p className="text-lg text-indigo-600 font-bold">
                    {props.word}</p>
                <SpeakButton onClick={() => props.say(props.word)} />
            </div>
        </div>
    );

}