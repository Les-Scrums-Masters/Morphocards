import { VolumeUpIcon } from "@heroicons/react/outline";
import React from "react";

export default function SpeakButton(props) {

    return(<button onClick={props.onClick} className="h-5 w-5 text-indigo-500 transform transition duration-200 active:scale-95 hover:scale-110 hover:text-indigi-200 focus:ring rounded-full">
        <VolumeUpIcon />
        </button>);  

}