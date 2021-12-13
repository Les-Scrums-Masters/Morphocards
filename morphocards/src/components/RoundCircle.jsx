import React, { useState } from "react";

export default function RoundCircle(props) {

    return(
        <div>
            <div className={"bg-" + props.color + " w-5 h-5 rounded-full mx-0.5"}></div>
        </div>
    );

}