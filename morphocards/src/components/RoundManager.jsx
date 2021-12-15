import React from "react";
import RoundCircle from "./RoundCircle";

export default function Round(props) {

    function getState (roundModal) {
        let state;
        if(roundModal.done) {
            if(roundModal.success) {
                state = "true";
            } else {
                state = "false";
            } 
        } else if (roundModal.id === props.actualRound) {
            state = "actual";
        } else {
            state = "null";
        }
        return state;
    }

     function getColor (state) {
        if(state === "true") {
            return "green-400";
        } else if (state === "false") {
            return "red-400";
        } else if (state === "null") {
            return "gray-400";
        } else {
            return "white";
        }
    }

    return (
        <div className="flex ">
            {
                
                props.historyRound.map((element, index) => {
                    return <RoundCircle color={getColor(getState(element))}/>
                })
            }
        </div>
        
    );

    
}
