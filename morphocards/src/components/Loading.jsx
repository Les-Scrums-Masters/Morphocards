import React from "react";


/**
 * Chargement : le placement (trou) où une carte doit être placé
 *
 * @component Loading
 * @visibleName Loading
 *
 * @example
 * <Loading />
 *
 * @return {JSX} Le rendu jsx du chargement.
 */
function Loading(props) {

    return(
        <div className="grid justify-center items-center h-32 text-white font-bold gap-3">
            <svg className="animate-spin h-10 w-10 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"className="opacity-75"></path>
            </svg>
            <p>Chargement ...</p>
        </div>
    );
}

export default Loading;
