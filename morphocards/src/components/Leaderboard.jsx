import React, { useState, useEffect } from "react";
import Firebase from "../Firebase";



/**
 * Classement détaillé : le classement détaillé (Top 100 des meilleurs joueurs)
 *
 * @component Leaderboard
 *
 * @example
 * <Leaderboard />
 *
 * @return {JSX} Le rendu jsx du classement détaillé
 */


function Leaderboard(props) {

    const [initialized, setInitialized] = useState(false);
    const [data, setData] = useState(null);

    useEffect(()=> {

        async function getData() {
            let result = await Firebase.getLeaderboard(100);
            setData(result);
        }

        if (!initialized) {
            setInitialized(true);
            getData();
        }

    }, [initialized, data])

    const loadingTab = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    let gap = (data === null) ? "gap-3" : "gap-0";

    return (
        <div className={"pt-2 flex flex-col divide-y " + gap}>
        {(data === null)
            ? (
                loadingTab.map((index) => <div key={"loading"+index} className="w-52 bg-gray-900 opacity-30 h-4 rounded animate-pulse "></div>)
            )
            : data.map(((element, index) => <LeaderboardItem position={index+1} key={index} item={element} />))
        }
        </div>
    );

}

function LeaderboardItem(props) {

    return (
        <div className="flex gap-2 items-center text-black w-full py-1">
            <p className="font-bold w-12 text-right">{"#"+props.position}</p>
            <p className="flex-1 text-left">{props.item.name}</p>
            <p className="italic font-bold">{Firebase.getTime(props.item.time)}</p>
        </div>
    );

}

export default Leaderboard;
