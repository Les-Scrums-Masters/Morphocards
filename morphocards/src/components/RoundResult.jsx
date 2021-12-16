import { CheckIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import WordDisplay from "./WordDisplay";


/**
 * Résultat d'un round : Affichage d'un seul round
 *
 * @component RoundResult
 *
 * @param   {string} key  Id unique d'un resultat
 * @param   {RoundData} item Donnée d'un seul round
 * @param   {function} say   Fonction pour faire parler la synthèse vocale
 * @param   {int} number  le round actuel
 *
 * @example
 * <RoundResult key={index} say={props.say} round={item} number={index+1} />
 *
 * @return {JSX} Le rendu jsx du resultat du round
 */


function RoundResult(props) {

    let svgClass="h-10 w-10 "

    return(
        <div className="flex justify-start md:justify-center flex-wrap gap-3 items-center p-3 rounded-lg mx-auto hover:shadow-lg transition ease-out duration-100 w-full md:w-8/12 bg-gray-100 shadow-sm">

            {props.round.success
                ? <CheckIcon className={svgClass+"text-green-600"} />
                : <XIcon className={svgClass+"text-red-600"} />
            }

            <p className="text-gray-800 uppercase font-bold text-left w-1/5	">Round #{props.number}</p>

            <div className="flex-grow">
                <WordDisplay word={props.round.word.id} legend="Le mot était" say={props.say} align="left"/>
            </div>

            {props.round.success
                ? ""
                :   (
                    <div className="w-1/3">
                        <WordDisplay word={props.round.userWord} legend="Vous avez écrit" say={props.say} align="left" />
                    </div>
                    )
            }

        </div>
    );

}

export default RoundResult;
