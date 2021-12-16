import React, { forwardRef, useImperativeHandle } from 'react';



/**
 * Carte plateau : la carte initialement placé sur le plateau (statique -> pas de déplacement)
 *
 * @component CardStatic
 *
 * @param   {int} index  Numéro de placement
 * @param   {string} key  Id unique de la carte (numero)
 * @param   {Ref} ref  Référence du composant
 * @param   {string} value   Valeur de la carte
 *
 * @example
 * <CardStatic key={index} index={index} ref={boardRefs[index]} value={card.value} />
 *
 * @return {JSX} Le rendu jsx de la carte plateau.
 */
const CardStatic = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            getValue() {
                return props.value;
            }
        }
    ));

    return (
        <div className="card">
            <h3 className="select-none">{props.value}</h3>
        </div>
    );

})

export default CardStatic;
