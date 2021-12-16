import React, {useRef, useImperativeHandle} from "react";
import RoundCircleList from "./RoundCircleList";
import MusicSound from './MusicSound';
import Timer from './Timer';
import AppLogo from "./AppLogo";

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
                <AppLogo onClick={props.openMenu} />
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
