import React from "react";


/**
 * Logo de l'application
 *
 * @component AppLogo
 *
 * @param   {function} onClick  Fonction qui s'execute lorsqu'on clique sur le logo
 *
 * @example
 * <AppLogo onClick={props.openMenu} />
 *
 * @return {JSX} Le rendu jsx du logo de l'application.
 */

function AppLogo(props) {

    return (
        <button onClick={props.onClick} className={"text-2xl text-white opacity-50 hover:opacity-100 transition ease-out duration-200 flex items-center gap-2 " + props.additionnalStyle}>

            <img src="/logo192.png" className="h-10 w-10" alt="Morphocards Logo" />

            <h3>

            <h3 className="text-2xl text-white text-opacity-50 hover:text-opacity-100 transition ease-out duration-200">

                <span className="font-extrabold">Morpho</span>
                cards
            </h3>
        </button>
    );

}

export default AppLogo;
