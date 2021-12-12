import React from "react";

export default function RoundButton(props) {

    let className = ((props.animated) ? "animate-pulse" /*"animate__animated animate__pulse animate__infinite"*/ : "")

    return(
        <div className="flex flex-col justify-center gap-3 md:gap-3 items-center text-center mt-5">
            <button onClick={props.onClick} className={"roundBtn " + className}>{props.children}</button>
            <label className="w-16 md:w-44 text-center font-medium uppercase text-white text-opacity-60 text-xs md:text-base h-8 md:h-16 break-words select-none">{props.label}</label>
        </div>
    );

}