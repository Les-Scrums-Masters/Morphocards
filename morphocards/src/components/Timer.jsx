import { useStopwatch } from 'react-timer-hook';
import React, { useImperativeHandle, } from 'react'




/**
 * Minuteur : le minuteur du jeu
 *
 * @component Timer
 *
 * @param   {Ref} ref  Référence du composant
 *
 * @example
 * <Timer ref={timerRef}/>
 *
 * @return {JSX} Le rendu jsx du minuteur.
 */


const Timer = React.forwardRef((props, ref) => {



    const time = new Date();
    time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

    const {
        seconds,
        minutes,
        reset,
        pause,
        /*isRunning,
        start,
        resume,
        */
      } =useStopwatch({ autoStart: true });


      const getStylizedTime = () => {
         return Math.trunc(minutes/10) + "" + minutes%10 + ":" + Math.trunc(seconds/10) + "" + seconds%10;
      }




      useImperativeHandle(ref, () => ({

        getSeconds() {
            return minutes*60 + seconds;
        },

        stopTime() {
            pause();
        },

        getTime(){
            return getStylizedTime();
        },

        restartTimer(){
            reset();
        }
    }))

    return(
        <p className={"text-white text-opacity-50 text-lg " + props.classStyle}>{getStylizedTime()}</p>
    );

});

export default Timer;
