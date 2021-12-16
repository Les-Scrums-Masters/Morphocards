import { ChevronLeftIcon } from "@heroicons/react/outline";
import React from "react";

function BackButton(props) {

    return (
        <button onClick={props.onClick} className="flex items-center gap-2 hover:gap-5 text-indigo-500 text-opacity-50 hover:text-opacity-100 transition-all ease-out duration-200">
            <ChevronLeftIcon className="h-4 w-4" />
            <p>{props.children}</p>
        </button>
    );

}

export default BackButton;