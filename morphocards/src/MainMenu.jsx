import { ArrowRightIcon } from '@heroicons/react/outline';
import React, {useState, useEffect} from 'react';
import Firebase from "./Firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Button from './components/Button';
import MusicSound from './components/MusicSound';
import Loading from './components/Loading';


export default function MainMenu(props){


  const play = () => {
    props.setWindow("game");
  }

  useEffect(() => {
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        // LOGGED
        props.setLogged(true);
      } else {
        // PAS LOGGED :
        props.setLogged(false);
      }
    });
  }, [])

  return(
    <div className="w-full h-full overscroll-none overflow-hidden flex items-center
    bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate">

      <div className='w-full h-full bg-white bg-opacity-25 background-filter backdrop-blur-lg	flex items-center'>

      <div className='w-auto md:w-4/12 rounded-xl bg-white shadow-md p-6 mx-auto flex flex-col justify-center gap-5'>

        <img src="/logo512.png" className='h-36 w-36 mx-auto' alt="Morphocards Logo" />

        <h1 className="text-4xl text-gray-900 text-center"><span className="font-extrabold">Morpho</span>cards</h1>

        <p className='text-center'>Jouez a morphocards parce que c'est un bon jeu :)</p>

        <Button onClick={play} color='bg-indigo-500 text-white ring-indigo-200 hover:bg-indigo-400 active:bg-indigo-800 mt-5' paddingY="py-3" textSize="text-lg">
          <div className='flex-1'></div>
          Jouer
          <div className='flex-1 flex justify-end'>
            <ArrowRightIcon className='h-8 w-8'/>
          </div>
        </Button>
          {
            props.isLogged ?
              Firebase.auth.currentUser.displayName
              :       (<div id="login">
                          <StyledFirebaseAuth uiConfig={Firebase.uiConfig} firebaseAuth={Firebase.auth} />
                      </div>)
          }

      </div>
      { props.sound !== null ?

          ( <MusicSound sound={props.sound} style={"absolute right-5 top-5" } /> )
          : ""

      }

      <a href="https://git.unistra.fr/les-scrums-masters/foc21-t3-a" className='absolute bottom-5 right-8 text-white text-opacity-50 hover:text-opacity-100'>
      Les Scrums Masters © 2021
      </a>

    </div>

    </div>
  );
}
