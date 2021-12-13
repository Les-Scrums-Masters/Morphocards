import React from "react";
import RoundManager from "./RoundManager";

export default function GameBar(props) {

    return(
        <div className="w-full bg-white bg-opacity-10 flex flex-col items-center justify-center py-5">
            <p className="text-white">Morphocards</p>
            <RoundManager round={props.round} actualRound={props.actualRound} historyRound={props.historyRound}/>
        </div>
    );

}