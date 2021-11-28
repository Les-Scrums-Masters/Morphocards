import React from 'react';
import Card from './card';
import { Droppable } from 'react-beautiful-dnd';

export default class CardPlacement extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      card: null
    };

  }

  updateCardLocal = (newCard) =>{
    this.setState({
      card:newCard
    });
    //this.state = newCard;
  }

  getCardPlacement = () =>{
    if(this.state.card !== null){
      return this.state.card;
    }
    return null;
  }

  getValue = () =>{
    if(this.state.card !== null){
      return this.state.card.id;
    }
    return "";
  }

  //{ this.state.card?.map((card, index)=> ( <Card index={index} key={card.id}  id={""+card.id} value={card.value} /> )) }
    render (){
        return (
            <Droppable droppableId={this.props.id}>
                {provided =>(
                    <div className="cardPlacement"
                    ref={provided.innerRef}
                    {...provided.droppableProps}>

                    {this.state.card !== null ? <Card index={0} key={this.state.card.id}  id={""+this.state.card.id} value={this.state.card.value} /> : null }


                        {provided.placeholder}
                    </div>

                )}
            </Droppable>

        )
    }
}
