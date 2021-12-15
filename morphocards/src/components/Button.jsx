import React from "react";

import useSound from 'use-sound';

import clickSound from '../sounds/button_click.ogg'

export default function Button(props) {

    const [playClick] = useSound(clickSound, {
      volume: 0.25,
      interrupt: false
    })

    const paddingY = props.paddingY ?? "py-2";

    const textSize = props.textSize ?? "text-base";

    return(<button
        type="button"
        className={"w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 font-bold transition ease-out duration-200 focus:outline-none hover:ring-4 focus:ring-offset-2 gap-3 items-center "+ props.color + " " + paddingY + " " + textSize}
        onClick={() => {
          props.onClick();
          playClick();
        }}>
        {props.children}
      </button>);

}