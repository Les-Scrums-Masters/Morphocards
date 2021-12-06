import React from "react";

export default function RoundButton(props) {

    return(
        <div className="btnGroup">
            <button onClick={props.onClick} className="roundBtn">{props.children}</button>
            <label>{props.label}</label>
        </div>
    );

}