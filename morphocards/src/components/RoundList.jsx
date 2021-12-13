import React from "react";
import RoundCircle from "./RoundCircle";

export default function RoundList(props) {

    return (
        <div className="flex gap-2">
            {
                props.rounds.map((element, index) => {
                    return <RoundCircle key={index} round={element} isActive={(index === props.actualRound)} />
                })
            }
        </div>
        
    );

    
}