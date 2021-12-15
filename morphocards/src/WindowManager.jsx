import React, {useEffect, useState} from 'react';
import MainMenu from './MainMenu'
import GameManager from './GameManager'

// Sons
import useSound from 'use-sound';
import musicSound from './sounds/lofi.ogg';


export default function WindowManager(){



  // ------- Musique -------

  const [initializedSound, setInitializedSound] = useState(false);
  const [ , {sound}] = useSound(musicSound, {
    volume: 0.05,
    interrupt: false
  })  

  //menu, game
  const [window, setWindow] = useState("menu");

  //Si l'utilisateur est connecté ou pas
  const [ isLogged, setLogged ] = useState(false);
  useEffect(()=> {
    
    // LANCER LA MUSIQUE LORSQU'ELLE EST ACTUALISEE
    if (sound !== null && !initializedSound) {
      // LANCER LA MUSIQUE
      console.log("Music launched");
      setInitializedSound(true);
      sound.loop(true);
      sound.play();
      
    }
  }, [sound, initializedSound]);

  
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
