import { ChevronLeftIcon } from "@heroicons/react/outline";
import React from "react";

import useSound from 'use-sound';

import clickSound from '../sounds/button_click.ogg'

function BackButton(props) {

    const [playClick] = useSound(clickSound, {
        volume: 0.3,
        interrupt: false
      })
  

    return (
        <button onClick={() => {props.onClick(); playClick()}} className="flex items-center gap-2 hover:gap-5 text-indigo-500 text-opacity-50 hover:text-opacity-100 transition-all ease-out duration-200">
            <ChevronLeftIcon className="h-4 w-4" />
            <p>{props.children}</p>
        </button>
    );

}

export default BackButton;