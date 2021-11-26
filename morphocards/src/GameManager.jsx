import React from 'react';
import Board from './components/board';
import Loading from './components/Loading';
import cardData from './initial-data.js';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand, {handUpdateCards, getCards} from './components/hand';
import CardPlacement, {updateCardPlacement, getCardPlacement} from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import App from './App'
import Firebase from './Firebase'

export default class GameManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      handCards:[]
    };

    //Tableau qui contiendra tout les élements du board
    this.boardItems = [ <CardStatic value='m'/> ,<CardPlacement  />,  <CardStatic value='g'/> ,<CardPlacement />]

  }
  componentDidMount(){
    this.getData();
  }

  async getData(){
    let handCards = await Firebase.getHandCards();
    handCards.map( (card, index) =>(
      card.position = index
    ) );
    this.setState( {handCards:handCards} );
  }

  render() {
    if(this.state.handCards.length === 0 ){
      return (
        <Loading />
      )
    } else{
      return(<App handCards={this.state.handCards} boardItems={this.boardItems} />);
    }
  }

}
