import React, { useEffect, useState } from "react";
import Firebase from "../Firebase";

function LeaderboardPreview(props) {

    const [data, setData] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(()=> {

        async function getData() {
            let result = await Firebase.getLeaderboard();
            setData(result);
        }

        if (!initialized) {
            setInitialized(true);
            getData();            
        }

    }, [initialized, data])

    const loadingTab = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    return (
        <div className="absolute md:right-8 opacity-0 md:opacity-100">
            <div className="flex-col justify-end divide-y">
            <h3 className="text-xl text-white font-bold uppercase italic text-right pb-2">Classement</h3>

            <div className="pt-2 flex flex-col gap-2">
            {(data === null) 
                ? (
                    loadingTab.map((index) => <div className="w-52 bg-white opacity-30 h-4 rounded animate-pulse "></div>)
                )
                : data.map(((element, index) => <LeaderboardPreviewItem position={index} key={index} item={element} />))
            }
            </div>
            </div>
        </div>
    );

}

function LeaderboardPreviewItem(props) {

    return (
        <div className="flex gap-2 items-center text-white w-52">
            <p className="font-semibold flex-1">{props.item.name}</p>
            <p className="italic">{Firebase.getTime(props.item.time)}</p>
        </div>
    );

}

export default LeaderboardPreview;