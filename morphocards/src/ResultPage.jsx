import React, { useCallback, useEffect, useState } from "react";
import Firebase from "./Firebase";
import Loading from "./components/Loading";
import RoundHistoryList from "./components/RoundHistoryList";
import BackButton from "./components/BackButton";
import { CalendarIcon, ClockIcon } from "@heroicons/react/outline";

import useSound from 'use-sound';

import clickSound from './sounds/button_click.ogg'

export default function ResultPage(props) {

    const [games, setGames] = useState([]);
    const [ initialized, setInitialized ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);

    const getData = useCallback(async () => {
        let result = await Firebase.getGames(props.userId);
        result.forEach((element) => element.generate());
        setGames(result);
        setLoaded(true);
    }, [setGames, setLoaded, props.userId]);

    useEffect(() => {

        if (!initialized) {
            setInitialized(true);
            getData();
        }

    }, [setInitialized, getData, initialized]);


    if (loaded) {
        return (
            <ResultContent data={games} backToMenu={props.backToMenu} />
        );
    } else {
        return (<Loading />);
    }
    
}

function ResultContent(props) {

    const [toShow, setToShow] = useState(null);

    const openGame = (id) => {
        setToShow(id);
    };
    
    const goToList = () => {
        setToShow(null);
    }

    return(
        <div className="container bg-white mx-auto h-4/5 rounded-xl w-full flex gap-3 justify-center items-center">
            {(toShow !== null) 
                ? (<GameInfo key={toShow} game={props.data.filter((element) => element.id === toShow)[0]} goBack={goToList} />)
                // Aucune partie à afficher, afficher la liste :
                :   (<div className="grid gap-3 flex-1 h-full w-full py-5">
                        <div className="mx-5">
                            <BackButton onClick={props.backToMenu}>Retour au menu principal</BackButton>
                        </div>
                        <h3 className="text-bold text-2xl font-bold text-center">Vos parties</h3>
                        
                       {(props.data.length > 0)
                        ? ( <div className="grid grid-cols-1 divide-y w-full overflow-y-auto">
                            {props.data.map((element, index) => {
                                return <GameItem game={element} key={index} onClick={openGame} />;
                            })}
                        </div>)
                        : (<p className="text-center">Ce joueur n'a aucune partie</p>)}

                    </div>)}
        </div>
    );

}

function GameItem(props) {

    const [playClick] = useSound(clickSound, {
        volume: 0.3,
        interrupt: false
      })

    return (
        <button onClick={() => {
            props.onClick(props.game.id);
            playClick();
        }} className="hover:bg-gray-100 transition ease-out duration-200 active:bg-gray-200 py-3 flex md:flex-col px-3 md:px-20 sm:h-auto flex-wrap items-center md:items-start gap-3 sm:gap-0 h-full justify-center sm:justify-start">
                <p className="font-bold text-lg text-left">
                    {"Partie #" + props.game.id}
                </p>
                <div className="flex gap-1 sm:gap-3 flex-col sm:flex-row w-full text-center sm:text-left justify-center sm:justify-start">
                    <p className="italic font-medium">{props.game.successes+"/"+props.game.rounds.length}</p>
                    <TimeDisplay time={props.game.time} additionnalStyle="sm:flex-1"/>
                    <DateDisplay date={props.game.date} />
                </div>
            
        </button>
    );

}

function GameInfo(props) {

    return (
        <div className="h-full w-full flex flex-col gap-3 items-center py-5 flex-1">
            <div className="w-full px-5 text-left">
                <BackButton onClick={props.goBack}>Retour à la liste</BackButton>
            </div>
            <h1 className="font-bold text-2xl text-center">{"Partie #" + props.game.id}
            </h1>
            <DateDisplay date={props.game.date} />
            <TimeDisplay time={props.game.time} />

            <RoundHistoryList rounds={props.game.rounds} />

        </div>
    );

}

function DateDisplay(props) {

    return (
        <div className="text-gray-500 flex gap-3 items-center">
            <CalendarIcon className="h-4 w-4" />
            <p>{Firebase.getDate(props.date)}</p>    
        </div>
    );

}

function TimeDisplay(props) {

    return (
        <div className={"text-gray-500 flex gap-2 items-center " + props.additionnalStyle}>
        <ClockIcon className="h-4 w-4" />
        <p>{Firebase.getTime(props.time)}</p>
        </div>
    );

}