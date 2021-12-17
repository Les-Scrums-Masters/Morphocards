import React, {useState, useEffect} from "react";
import Button from "./components/Button";
import ReactCanvasConfetti from 'react-canvas-confetti';
import Firebase from './Firebase'
import useSound from "use-sound";
import finishedSound from './sounds/win.ogg';
import RoundHistoryList from "./components/RoundHistoryList";



const tips = [
  'Privilégie la tranquilité pour ne pas te tromper dans tes réponses.',
  'Ne t\'occupes pas des remarques des autres personnes et donne le max !',
  'Le timer est facultatif, ne cherche pas la rapidité.',
  'Utilise un maximum les fonctionnalités pendant ta partie (bouton pour réécouter, pour recommencer, ...).',
'  Écoute bien la voix du jeu au lieu d\'utiliser directement le texte.',
  'Si les consignes te paraissent flous, essaie de bien comprendre le jeu avant de te lancer.'
];
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
    const [tip, setTip] = useState("");

    // Fonction qui retourne un élément choisi au hasard dans la liste
    const pickRandomList = (list) => {
      return list[Math.floor(Math.random() * list.length)];
    }

    useEffect(() => {

        if(!initialized) {
            setInitialized(true);
            setconfetti( {fire: {}} );
            setTip(pickRandomList(tips));
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
        <div className="container bg-white h-4/5 rounded-xl w-full flex flex-col gap-3 justify-center items-center p-5 m-auto">

                <h1 className="text-6xl">{String.fromCodePoint(0x1F973)}</h1>
                <h3 className="text-2xl text-gray-900 font-bold mt-5">{props.title}</h3>
                <h5 className="text-xl text-gray-900 mt-5">{props.time}</h5>

                <RoundHistoryList rounds={props.rounds} say={props.say} />

                <p className="flex-1 text-center"><b>Conseil:</b> {tip}</p>

                <div className="flex gap-3 items-center w-full">

                    <Button onClick={props.goToMenu} color="ring-red-200 text-white hover:bg-red-700 bg-red-600">
                        Retour au menu principal
                    </Button>

                    <Button onClick={props.restartGame} color="text-white hover:bg-indigo-700 bg-indigo-600 ring-indigo-200">
                        Rejouer
                    </Button>

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
