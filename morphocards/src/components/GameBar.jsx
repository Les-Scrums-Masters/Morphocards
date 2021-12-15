import React, {useRef, useImperativeHandle} from "react";
import RoundList from "./RoundList";
import MusicSound from './MusicSound';
import Timer from './Timer';

const GameBar = React.forwardRef((props, ref) => {

    // ---------- Timer ------------
    const timerRef = useRef();

    useImperativeHandle(ref, () => ({


        getTime(){
            //Renvoie le temps de son timer
            return timerRef.current.getTime();
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
                <RoundList rounds={props.rounds} actualRound={props.actualRound} />
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
