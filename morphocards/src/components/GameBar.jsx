import React, {useRef, useImperativeHandle} from "react";
import RoundCircleList from "./RoundCircleList";
import MusicSound from './MusicSound';
import Timer from './Timer';



/**
 * Bar de jeu : la bar situé au haut de l'écran durant le jeu
 *
 * @component GameBar
 *
 * @param   {RoundData[]} rounds  listes des rounds
 * @param   {RoundData} actualRound  le round actuel
 * @param   {function} openMenu  Fonction de retour au menu principal
 * @param   {function} sound  Fonction pour faire parler la synthèse vocale
 * @param   {Ref} ref  Référence du composant
 *
 * @example
 * <GameBar rounds={rounds} actualRound={actualRound} openMenu={openMainMenu} sound={props.sound} ref={gameBarRef} />
 *
 * @return {JSX} Le rendu jsx de la liste de round
 */

const GameBar = React.forwardRef((props, ref) => {

    // ---------- Timer ------------
    const timerRef = useRef();

    useImperativeHandle(ref, () => ({

        getTimeComponent() {
            return timerRef.current;
        },

        restartTimer(){
            timerRef.current.restartTimer();
        }
    }))

    return(
        <div className="w-full flex flex-col md:flex-row items-center py-6 px-10 gap-4">

            <div className="flex-1">
               <button onClick={props.openMenu}>
                    <h3 className="text-2xl text-white text-opacity-50 hover:text-opacity-100 transition ease-out duration-200"><span className="font-extrabold">Morpho</span>cards</h3>
               </button>
            </div>

            <div className="flex flex-col gap-1 justify-center items-center align-middle">
                <p className="font-bold text-white uppercase">
                    {(props.rounds.length === props.actualRound)

                        ? "Partie terminée"
                        : "Round " + (props.actualRound+1) +"/"+props.rounds.length
                    }
                </p>
                <RoundCircleList rounds={props.rounds} actualRound={props.actualRound} />
            </div>
            <div className="flex-1 flex justify-end items-center gap-3">
                {props.rounds.length === props.actualRound
                    ? (<Timer classStyle={"hidden"} ref={timerRef}/>)
                    : (<Timer ref={timerRef}/>)
                }
                <MusicSound sound={props.sound} />
            </div>
        </div>
    );

});

export default GameBar;
