import React from "react";
import SpeakButton from "./SpeakButton";


/**
 * Affichage de mot : l'affichage du mot lors d'un fin de round
 *
 * @component WordDisplay
 *
 * @param   {string} word  Valeur du mot
 * @param   {string} legend  Label affiché
 * @param   {function} say   Fonction pour faire parler la synthèse vocale
 * @param   {string} align  CSS alignement en flex
 *
 * @example
 * <WordDisplay word={props.round.word.id} legend="Le mot était" say={props.say} align="left"/>
 *
 * @return {JSX} Le rendu jsx de l'affichage de mot.
 */

function WordDisplay(props) {


    let textAlign = props.align === "center"
                ? "text-center"
                : "text-left"


    let flexAlign = props.align === "center"
                ? "justify-center"
                : "justify-start"

    return(
        <div className={"flex flex-col " + flexAlign}>
            <p className={"text-sm text-gray-500 " + textAlign}>{props.legend}</p>
            <div className={"flex flex-row items-center gap-3 " + flexAlign}>
                <p className="text-lg text-indigo-600 font-bold">
                    {props.word}</p>
                <SpeakButton onClick={() => props.say(props.word)} />
            </div>
        </div>
    );

}
export default WordDisplay;
