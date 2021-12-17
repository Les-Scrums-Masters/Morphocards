import RoundResult from "./RoundResult";

import React from "react";


/**
 * Historique des rounds : l'historique des rounds en affichage
 *
 * @component RoundHistoryList
 *
 * @param   {RoundData[]} rounds  listes des rounds à afficher
 *
 * @example
 * <RoundList rounds={myRounds} actualRound={actualRound} />
 *
 * @return {JSX} Le rendu jsx de l'historique des rounds
 */

function RoundHistoryList(props) {

    return(
        <div className="flex flex-col gap-4 justify-center w-full h-full overflow-y-auto">

        {props.rounds.map((item, index) => (
            <RoundResult key={index} say={props.say} round={item} number={index+1} />
        ))}

        </div>
    );

}
export default RoundHistoryList;
