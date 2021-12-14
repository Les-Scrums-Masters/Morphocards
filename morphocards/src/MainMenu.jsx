import { ArrowRightIcon } from '@heroicons/react/outline';
import React from 'react';

export default function MainMenu(props){

  const play = () => {
    props.setWindow("game");
  }

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

        <button onClick={play} className='bg-indigo-500 w-full font-bold text-white text-lg rounded-xl py-3 px-5 hover:ring-4 ring-indigo-200 transition-all duration-200 ease-out hover:bg-indigo-400 active:bg-indigo-800 flex gap-3 items-center justify-center mt-5'>
          <div className='flex-1'></div>
          Jouer 
          <div className='flex-1 flex justify-end'>
            <ArrowRightIcon className='h-8 w-8'/>
          </div>
        </button>


      </div>
      
      <a href="https://git.unistra.fr/les-scrums-masters/foc21-t3-a" className='absolute bottom-5 right-8 text-white text-opacity-50 hover:text-opacity-100'>
      Les Scrums Masters © 2021
      </a>

    </div>

    </div>
  );
}
