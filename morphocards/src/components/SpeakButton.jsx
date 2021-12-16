import { VolumeUpIcon } from "@heroicons/react/outline";
import React from "react";


/**
 * Bouton d'écoute : les petits boutons d'écoute dans les modals et résultat
 *
 * @component SpeakButton
 *
 * @param   {function} onClick  Fonction qui s'execute lorsqu'on clique sur le bouton
 *
 * @example
 * <SpeakButton onClick={() => say(word)} />
 *
 * @return {JSX} Le rendu jsx du bouton de réecoute.
 */

function SpeakButton(props) {

    return(<button onClick={props.onClick} className="h-5 w-5 text-indigo-500 transform transition duration-200 active:scale-95 hover:scale-110 hover:text-indigi-200 focus:ring rounded-full">
          <VolumeUpIcon />
        </button>);

}

export default SpeakButton;
