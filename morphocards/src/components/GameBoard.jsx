import React, { useImperativeHandle, useRef } from "react";
import CardPlacement from './CardPlacement';
import CardStatic from './CardStatic'

const GameBoard = React.forwardRef((props, ref) => {


    // Création d'une référence pour chaque emplacement plateau
    let boardRefs = []
    props.word.cards.map( () => (
      boardRefs.push(useRef())
    ));
    

    // Fonctions incluses dans useImperativeHandle afin qu'elles soientaccésibles depuis le parent
    useImperativeHandle(ref, () => ({


        // Fonction d'obtention du mot formé par le plateau
        getWord() {
            let w = "";
            boardRefs.forEach((ref) =>{
            w += ref.current.getValue();
            });
            return w;
        },


        // Fonction qui retourne le nombre d'emplacements vides
        getEmptyCount() {
            // On vérifie si tous les emplacements sont remplis :
            let nbEmpty = 0;

            // Récupère le nombre de placement vide et le ref du dernier
            boardRefs.forEach((ref) => {
                if(ref.current.getValue() === ""){
                    nbEmpty++;
                }
            });
            
            return nbEmpty;
        },


        // Fonction qui retourne l'emplacement demandé
        getEmplacement(droppableId) {
            return boardRefs[parseInt(droppableId)].current;
        },


        // Fonction qui vérifie la victoire
        checkWin() {
            if (this.getEmptyCount() === 0) {
                return true;
            }
            return false;
        }

    }))
    

    // Rendu
    return(
        <div className='flex justify-center items-center flex-wrap'>
            {props.word.cards?.map( (card, index) => {
    
                if(!card.isBoard){
                    return <CardPlacement id={" " + index} key={index} index={index} ref={boardRefs[index]} />;
    
                } else{
                    return <CardStatic id={" " + index} key={index} index={index} ref={boardRefs[index]} value={card.value} />;
                }
    
            })}
        </div>  
    );

});

export default GameBoard;