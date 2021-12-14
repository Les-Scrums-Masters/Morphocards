import React from "react";
import Button from "./components/Button";
import RoundResult from "./components/RoundResult";

export default function EndPage(props) {

    return(

    <div className="container mx-auto h-full pt-5 pb-10">
        <div className="bg-white rounded-xl p-10 text-center h-full flex flex-col gap-3">
            <h1 className="text-6xl">{props.emoji}</h1>
            <h3 className="text-2xl text-gray-900 font-bold mt-5">{props.title}</h3>

            <div className="mt-10 flex flex-col gap-3">
                <h4 className="text-lg font-bold text-gray-800">Vos résultats</h4>

                <div className="flex flex-col gap-4 justify-center">

                    {props.rounds.map((item, index) => (
                        <RoundResult key={index} say={props.say} round={item} number={index+1} />
                    ))}

                </div>

            </div>

            <p className="flex-1 justify-items-end">Petit conseil ;)</p>

            <div className="flex gap-3 items-center">

                <Button onClick={props.goToMenu} color="focus:ring-red-500 text-white hover:bg-red-700 bg-red-600">
                    Retour au menu principal
                </Button>
                
                <Button onClick={props.restartGame} color="text-white hover:bg-indigo-700 bg-indigo-600 focus:ring-indigo-500">
                    Rejouer
                </Button>
                
            </div>

        </div>
    </div>

    );

}