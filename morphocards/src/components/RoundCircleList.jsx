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
                    return (<RoundCircle key={index} round={element} isActive={(index === props.actualRound)} />)
                })
            }
        </div>

    );

}

function RoundCircle(props) {

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
           <div className="bg-red-400 hidden"></div>
           <div className="bg-green-400 hidden"></div>
           <div className={"bg-" + getColor() + " shadow-sm w-4 h-4 rounded-full"}></div>
       </div>
   );

}

export default RoundList;
