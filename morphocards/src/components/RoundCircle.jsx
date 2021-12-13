import React from "react";

export default function RoundCircle(props) {

     function getColor() {
        if (props.isActive) {
            return "white filter drop-shadow-lg";
        } else if(props.round.success) {
            return "green-400";
        } else if (props.round.success === false) {
            return "red-400";
        } else {
            return "white bg-opacity-25";
        }
    }

    return(
        <div>
            <div className={"bg-" + getColor() + " shadow-sm w-4 h-4 rounded-full"}></div>
        </div>
    );

}