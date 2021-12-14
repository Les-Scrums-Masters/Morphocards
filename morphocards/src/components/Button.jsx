import React from "react";

export default function Button(props) {

    return(<button
        type="button"
        className={"w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 "+props.color}
        onClick={props.onClick}>
        {props.children}
      </button>);

}