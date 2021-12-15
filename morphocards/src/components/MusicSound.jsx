import React, {useState, useEffect} from "react";
import useSound from 'use-sound';


export default function MusicSound(props) {

    const size = 35;

    const logoPlaying =     (<svg className="opacity-50 hover:opacity-100" width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M173.6 35.6001C173.599 34.2395 173.296 32.896 172.714 31.6664C172.131 30.4368 171.283 29.3518 170.231 28.4894C169.178 27.6271 167.948 27.0089 166.628 26.6794C165.308 26.35 163.931 26.3174 162.597 26.5841L70.5967 44.9841C68.5119 45.4008 66.6357 46.5267 65.2873 48.1703C63.9388 49.814 63.2012 51.874 63.1999 54.0001V137.849C60.1839 137.146 57.0967 136.794 53.9999 136.8C38.7555 136.8 26.3999 145.034 26.3999 155.2C26.3999 165.366 38.7555 173.6 53.9999 173.6C69.2443 173.6 81.5999 165.366 81.5999 155.2V79.9441L155.2 65.2241V119.449C152.184 118.746 149.097 118.394 146 118.4C130.756 118.4 118.4 126.634 118.4 136.8C118.4 146.966 130.756 155.2 146 155.2C161.244 155.2 173.6 146.966 173.6 136.8V35.6001Z" fill="white"/>
                              </svg>)

    const logoStop = (<svg className="opacity-50 hover:opacity-100" width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="37.5938" y1="56.3165" x2="182.179" y2="148.428" stroke="white" stroke-width="11" stroke-linecap="round"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M172.714 31.6664C173.296 32.896 173.599 34.2395 173.6 35.6001V123.255L155.2 111.533V65.2241L99.877 76.2886L63.2594 52.9607C63.4596 51.2094 64.16 49.5444 65.2873 48.1703C66.6357 46.5267 68.5119 45.4008 70.5967 44.9841L162.597 26.5841C163.931 26.3174 165.308 26.35 166.628 26.6794C167.948 27.0089 169.178 27.6271 170.231 28.4894C171.283 29.3518 172.131 30.4368 172.714 31.6664ZM63.1999 65.9653V137.849C60.1839 137.146 57.0967 136.794 53.9999 136.8C38.7555 136.8 26.3999 145.034 26.3999 155.2C26.3999 165.366 38.7555 173.6 53.9999 173.6C69.2443 173.6 81.5999 165.366 81.5999 155.2V79.9441L84.2958 79.4049L63.1999 65.9653ZM145.51 118.403C130.492 118.577 118.4 126.743 118.4 136.8C118.4 146.966 130.755 155.2 146 155.2C161.244 155.2 173.6 146.966 173.6 136.8V136.298L145.51 118.403Z" fill="white"/>
                    </svg>)

    const [musicLogo, setMusicLogo] = useState(logoPlaying);



    useEffect(() => {

      // Affiche le bon état de la musique, (attente pour que la musique ai le temps de charger)
      setTimeout(() => {
        if(props.sound !== null){
          console.log(props.sound.playing());
          if( !props.sound.playing() ){
            setMusicLogo(logoStop);
          }
        }
      }, 50);

    }, [setMusicLogo])


    const playStop = () =>{
      if( props.sound.playing()){
        props.sound.pause();
        setMusicLogo(logoStop);
      }else{
        props.sound.play();
        setMusicLogo(logoPlaying);
      }
    }



    return(<button
        type="button"
        className={" "+ props.style}
        onClick={() => {
          playStop();
        }}>
        {musicLogo}
      </button>);

}
