import React, { useCallback, useEffect, useState } from "react";
import Firebase from "./Firebase";
import Loading from "./components/Loading";
import RoundHistoryList from "./components/RoundHistoryList";

export default function ResultPage(props) {

    const [games, setGames] = useState([]);
    const [ initialized, setInitialized ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);

    const getData = useCallback(async () => {
        let result = await Firebase.getGames(props.userId);
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
        return (
            <div className="grid gap-3 justify-center">
                <Loading />
                <button className="text-white text-opacity-50 hover:text-opacity-100" onClick={props.backToMenu}>Retour</button>
            </div>
        );
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

    console.log("id:" + toShow);
    if(toShow!== null) {
        console.log(props.data[toShow])
    }

    return(
        <div className="container bg-white mx-auto h-4/5 rounded-xl w-full grid gap-3 justify-center items-center">
            {(props.data.length === 0)
            // Aucune partie :
            ? (<p>Ce joueur n'a aucune partie</p>)
            // Afficher la partie n° toShow
            : (toShow !== null) 
                ? (<GameInfo key={toShow-1} game={props.data[toShow-1]} goBack={goToList} />)
                // Aucune partie à afficher, afficher la liste :
                :   (<div>
                        <button onClick={props.backToMenu}>Retour au menu principal</button>
                        <h3 className="text-bold text-xl">Vos parties</h3>
                        
                        <div className="grid gap-3">
                            {props.data.map((element, index) => {
                                return <GameItem game={element} key={index} onClick={openGame} />;
                            })}
                        </div>

                    </div>)}
        </div>
    );

}

function GameItem(props) {

    // TODO : Count success/fails

    return (
        <button onClick={() => props.onClick(props.game.id)}>
            <p>{"Partie #" + props.game.id}</p>
            <p>{props.game.date}</p>
        </button>
    );

}

function GameInfo(props) {

    return (
        <div>
            <button onClick={props.goBack}>Retour</button>
            <h1>{"Partie #" + props.game.id}</h1>
            <p>{props.game.date}</p>
            <p>{props.game.time}</p>

            <h4>Vos résultats</h4>

            <RoundHistoryList rounds={props.game.rounds} />

        </div>
    );

}