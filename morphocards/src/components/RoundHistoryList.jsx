import RoundResult from "./RoundResult";

import React from "react";

export default function RoundHistoryList(props) {

    return(
        <div className="flex flex-col gap-4 justify-center">

        {props.rounds.map((item, index) => (
            <RoundResult key={index} say={props.say} round={item} number={index+1} />
        ))}

        </div>
    );

}