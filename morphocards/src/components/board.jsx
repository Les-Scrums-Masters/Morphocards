import React from 'react';
import CardPlacement from './cardPlacement'



export default class Board extends React.Component{


  constructor(props){
    super(props);
    //this.cardEmpty1 = React.createRef();
    //this.cardEmpty2 = React.createRef();
    
    this.arrayRef = [];
    this.props.boardItems.map( () =>(
      this.arrayRef.push(React.createRef)
    ))


    console.log(this.arrayRef[0])
      console.log(this.arrayRef)

  }

  //Dans le cardPlacement dans render : ref={this.props.refs[index]}

    render (){

        return (
            <div className="board" >
                {this.props.boardItems?.map( (item, index) => (
                  <CardPlacement id={" " + index} key={index} index={index} ref={this.arrayRef[index]}  />
                ))}

            </div>
        )
    }

    updateBoard = (newCard, dropId) => {
      console.log('laaa')
      console.log(this.arrayRef[ parseInt(dropId) ])
      this.arrayRef[ parseInt(dropId) ].current.updateCardLocal(newCard);
      /*
      if(dropId === 1){
        console.log(this.cardEmpty1)

        console.log("ici 111  " )
        this.cardEmpty1.current.updateCardLocal(newCard);

      }else{
        console.log(this.cardEmpty1)

        console.log("ici else " + dropId)
        this.cardEmpty2.current.updateCardLocal(newCard);
      }*/
    }
}
