import React from "react";

import useSound from 'use-sound';

import clickSound from '../sounds/button_click.ogg'




/**
 * Bouton : les boutons rectangles de l'application
 *
 * @component Button
 *
 * @param   {function} onClick  Fonction qui s'execute lorsqu'on clique sur le bouton
 * @param   {string} color  Css color tailwind du bouton
 * @param   {string} paddingY  Css padding axe Y tailwind du bouton
 * @param   {string} textSize   Css taille du texte tailwind du bouton
 *
 * @example
 <Button onClick={play} color='bg-indigo-500 text-white ring-indigo-200 hover:bg-indigo-400 active:bg-indigo-800 mt-5' paddingY="py-3" textSize="text-lg">
  //buttonContent
 </Button>
 *
 * @return {JSX} Le rendu jsx du bouton.
 */

function Button(props) {

    const [playClick] = useSound(clickSound, {
      volume: 0.3,
      interrupt: false
    })

    const paddingY = props.paddingY ?? "py-2";

    const textSize = props.textSize ?? "text-base";

    return(<button
        type="button"
        className={"w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 font-bold transition-all ease-out duration-200 focus:outline-none hover:ring-4 focus:ring-offset-2 gap-3 items-center "+ props.color + " " + paddingY + " " + textSize}
        onClick={() => {
          props.onClick();
          playClick();
        }}>
        {props.children}
      </button>);

}
export default Button
