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
        <button onClick={props.onClick}>

            <h3 className="text-2xl text-white text-opacity-50 hover:text-opacity-100 transition ease-out duration-200">

                <span className="font-extrabold">Morpho</span>
                cards
            </h3>
        </button>
    );

}

export default AppLogo;
