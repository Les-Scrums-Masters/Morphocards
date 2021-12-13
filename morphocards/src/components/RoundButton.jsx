import React from "react";
import 'animate.css';

export default function RoundButton(props) {

    let className = ((props.animated) ? "animate__animated animate__pulse animate__infinite" : "")

    return(
        <div className="btnGroup">
            <button onClick={props.onClick} className={"roundBtn " + className}>{props.children}</button>
            <label>{props.label}</label>
        </div>
    );

}