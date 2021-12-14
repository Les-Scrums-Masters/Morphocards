import React, {useState} from 'react';
import MainMenu from './MainMenu'
import GameManager from './GameManager'

export default function WindowManager(){

  //menu, game
  const [window, setWindow] = useState("menu");


  // Rendu
  if( window === "game" ){
    return (
      <GameManager setWindow={setWindow} />
    );
  } else{
    return( 
      <MainMenu setWindow={setWindow} /> 
    );
  }


}
