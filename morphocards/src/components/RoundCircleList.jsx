import React from "react";


/**
 * Liste de round : le placement (trou) où une carte doit être placé
 *
 * @component RoundList
 *
 * @param   {RoundData[]} rounds  listes des rounds
 * @param   {RoundData} actualRound  le round actuel
 *
 * @example
 * <RoundList rounds={myRounds} actualRound={actualRound} />
 *
 * @return {JSX} Le rendu jsx de la liste de round
 */

function RoundList(props) {

    return (
        <div className="flex gap-2">
            {
                props.rounds.map((element, index) => {
                    return "" //<RoundCircle key={index} round={element} isActive={(index === props.actualRound)} />
                })
            }
        </div>

    );


}

export default RoundList;
