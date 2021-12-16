import { ArrowRightIcon } from '@heroicons/react/outline';
import React, {useEffect, useState} from 'react';
import Firebase from "./Firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Button from './components/Button';
import MusicSound from './components/MusicSound';
import ResultPage from './ResultPage';

export default function MainMenu(props){

  const play = () => {
    props.setWindow("game");
  }

  const [showList, setShowList] = useState(false);

  const goToList = () => {
    setShowList(true);
  }

  const backToMenu = () => {
    setShowList(false);
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
  }, [props])

  return(
    <div className="w-full h-full overscroll-none overflow-hidden flex items-center
    bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate">

      <div className='w-full h-full bg-white bg-opacity-25 background-filter backdrop-blur-lg	flex items-center justify-center'>

      {
        (showList)
          ? (<ResultPage backToMenu={backToMenu} />)
          : (<MenuContent play={play} isLogged={props.isLogged} goToList={goToList} />)
      }
      
      { props.sound !== null ?
          ( <MusicSound sound={props.sound} additionnalStyle="absolute right-10 top-8" />)
          : ""
      }

      <a target='_blank' href="https://git.unistra.fr/les-scrums-masters/foc21-t3-a" className='absolute bottom-5 right-8 text-white text-opacity-50 hover:text-opacity-100' rel="noopener noreferrer">
      Les Scrums Masters © 2021
      </a>

    </div>

    </div>
  );
}

function MenuContent(props) {

  return (
    <div className='w-auto md:w-4/12 rounded-xl bg-white shadow-md p-6 mx-auto flex flex-col justify-center gap-5'>

        <img src="/logo512.png" className='h-36 w-36 mx-auto' alt="Morphocards Logo" />

        <h1 className="text-4xl text-gray-900 text-center"><span className="font-extrabold">Morpho</span>cards</h1>

        <p className='text-center'>Jouez a morphocards parce que c'est un bon jeu :)</p>

        <div className='flex items-center justify-center mt-5 h-20'>
          <Button onClick={props.play} color='bg-indigo-500 text-white ring-indigo-200 hover:bg-indigo-400 active:bg-indigo-800' paddingY="py-3 hover:px-6 my-1 hover:my-0 hover:py-4" textSize="text-lg">
            <div className='flex-1'></div>
            Jouer
            <div className='flex-1 flex justify-end'>
              <ArrowRightIcon className='h-8 w-8'/>
            </div>
          </Button>
        </div>
          
        <div className='mt-5' >
        {
          props.isLogged 
            ? (
              <div id="user" className='text-center grid gap-3'>
                <p>Vous êtes connecté en tant que <span className='font-bold'>{Firebase.auth.currentUser.displayName}</span>
                </p>
                <Button color="bg-indigo-500 hover:bg-opacity-10 active:bg-opacity-20 text-indigo-500 bg-opacity-0" onClick={props.goToList}>Voir vos résultats</Button>
                <button className='text-red-500 hover:text-red-400 active:text-red-600' onClick={() => {
                  Firebase.logOut();
                }}>Se déconnecter</button>
              </div>
            ) 
            : (<div id="login">
                <p className='italic text-gray-500 text-center'>Connectez vous pour enregistrer vos parties et entrer dans le classement !</p>
                <StyledFirebaseAuth uiConfig={Firebase.uiConfig} firebaseAuth={Firebase.auth} />
              </div>)
        }
        </div>

      </div>
  );

}