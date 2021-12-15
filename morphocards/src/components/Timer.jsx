import { useStopwatch } from 'react-timer-hook';
import React, { useImperativeHandle, } from 'react'

const Timer = React.forwardRef((props, ref) => {



    const time = new Date();
    time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

    const {
        seconds,
        minutes,
        /*isRunning,
        start,
        pause,
        resume,
        restart,*/
      } =useStopwatch({ autoStart: true });

    
      const getStylizedTime = () => {
         return Math.trunc(minutes/10) + "" + minutes%10 + ":" + Math.trunc(seconds/10) + "" + seconds%10;
      }


      useImperativeHandle(ref, () => ({

        getTime(){
            return getStylizedTime();
        }
    }))

    return(
        <p className={"text-white text-opacity-50 text-lg " + props.classStyle}>{getStylizedTime()}</p>
    );

});

export default Timer;