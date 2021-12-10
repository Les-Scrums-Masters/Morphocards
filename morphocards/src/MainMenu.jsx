import React, {useState, useEffect, useCallback} from 'react';



export default function Main(props){



  const play = () => {
    props.setWindow("game");
  }

  return(
    <div className="w-full h-full overscroll-none overflow-hidden flex flex-col">

      <button onClick={play}>
        Jouer
      </button>

    </div>
  );
}
