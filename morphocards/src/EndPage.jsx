import React, {useState, useEffect} from "react";
import Button from "./components/Button";
import ReactCanvasConfetti from 'react-canvas-confetti';

import useSound from "use-sound";
import Firebase from './Firebase'

import finishedSound from './sounds/win.ogg';
import RoundHistoryList from "./components/RoundHistoryList";


export default function EndPage(props) {

    const [confetti, setconfetti] = useState({
        fire:{},
        confetti:null,
        reset:false
    })

    const [playFinishedSound, {sound}] = useSound(finishedSound, {
        volume: 0.35,
        interrupt: false
    })

    const [initialized, setInitialized] = useState(false);
    const [played, setPlayed] = useState(false);

    useEffect(() => {
        
        if(!initialized) {
            setInitialized(true);
            setconfetti( {fire: {}} );
            if(props.isLogged){
                Firebase.saveGame(props.rounds, props.timeValue);
            }
        }

        if(!played && sound !== null) {
            setPlayed(false);
            playFinishedSound();
        }

    }, [playFinishedSound, props.isLogged, props.rounds, initialized, played, sound, props.timeValue])



    return(
        <div className="container mx-auto h-full pt-5 pb-10">

            <div className="bg-white rounded-xl p-10 text-center h-full flex flex-col gap-3">
                <h1 className="text-6xl">{String.fromCodePoint(0x1F973)}</h1>
                <h3 className="text-2xl text-gray-900 font-bold mt-5">{props.title}</h3>
                <h5 className="text-xl text-gray-900 mt-5">{props.time}</h5>    

                <div className="mt-10 flex flex-col gap-3 h-full">
                    <h4 className="text-lg font-bold text-gray-800">Vos résultats</h4>

                    <RoundHistoryList rounds={props.rounds} say={props.say} />

                </div>

                <p className="flex-1 justify-items-end">Petit conseil ;)</p>

                <div className="flex gap-3 items-center">

                    <Button onClick={props.goToMenu} color="ring-red-200 text-white hover:bg-red-700 bg-red-600">
                        Retour au menu principal
                    </Button>

                    <Button onClick={props.restartGame} color="text-white hover:bg-indigo-700 bg-indigo-600 ring-indigo-200">
                        Rejouer
                    </Button>

                </div>

            </div>
            <ReactCanvasConfetti
            style={canvasStyles}
            // set the callback for getting instance. The callback will be called after initialization ReactCanvasConfetti component
            fire={confetti.fire}
            reset={confetti.reset}
            />
        </div>

    );

}

const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  }
