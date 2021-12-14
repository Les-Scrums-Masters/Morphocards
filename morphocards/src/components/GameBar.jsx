import React from "react";
import RoundList from "./RoundList";

export default function GameBar(props) {

    return(
        <div className="w-full flex flex-col md:flex-row items-center py-6 px-10 gap-4">

            <div className="flex-1">
               <button onClick={props.openMenu}>
                    <h3 className="text-2xl text-white text-opacity-50 hover:text-opacity-100 transition ease-out duration-200"><span className="font-extrabold">Morpho</span>cards</h3>
               </button>
            </div>

            <div className="flex flex-col gap-1 justify-center items-center align-middle">
                <p className="font-bold text-white uppercase">
                    {(props.rounds.length === props.actualRound)

                        ? "Partie terminée"
                        : "Round " + (props.actualRound+1) +"/"+props.rounds.length
                    }
                </p>
                <RoundList rounds={props.rounds} actualRound={props.actualRound} />
            </div>
            <div className="flex-1 flex justify-end">
                {props.rounds.length === props.actualRound
                    ? ""
                    : (<p className="text-white text-opacity-25 text-lg">0:00</p>)
                }
            </div>
        </div>
    );

}
