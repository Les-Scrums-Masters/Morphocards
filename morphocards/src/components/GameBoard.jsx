import React from "react";
import CardPlacement from './CardPlacement';
import CardStatic from './CardStatic'

export default function GameBoard(props) {

    return(
        <div className='flex justify-center items-center flex-wrap'>
            {props.word.cards?.map( (card, index) => {

            if(!card.isBoard){
                return <CardPlacement id={" " + index} key={index} index={index} ref={props.boardRefs[index]}  />;

            } else{
                return <CardStatic id={" " + index} key={index} index={index} ref={props.boardRefs[index]}  value={card.value}  />;
            }

            })}
        </div>  
    );

}