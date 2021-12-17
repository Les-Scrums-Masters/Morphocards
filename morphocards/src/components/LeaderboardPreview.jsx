import React, { useEffect, useState } from "react";
import Loading from "./Loading";
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

    return (
        <div className="absolute md:right-8 opacity-0 md:opacity-100">
            <div className="flex-col justify-end divide-y">
            <h3 className="text-xl text-white font-bold uppercase italic text-right pb-2">Classement</h3>

            <div className="pt-2">
            {(data === null) 
                ? (<Loading/>)
                : data.map(((element, index) => <LeaderboardPreviewItem key={index} item={element} />))
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