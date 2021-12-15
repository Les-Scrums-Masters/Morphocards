import React, {useState} from 'react';
import MainMenu from './MainMenu'
import GameManager from './GameManager'

export default function WindowManager(){

  //menu, game
  const [window, setWindow] = useState("menu");

  //Si l'utilisateur est connecté ou pas
  const [ isLogged, setLogged ] = useState(false);


  // Rendu
  if( window === "game" ){
    return (
      <GameManager setWindow={setWindow} isLogged={isLogged} />
    );
  } else{
    return(
      <MainMenu setWindow={setWindow} setLogged={setLogged} isLogged={isLogged} />
    );
  }


}
