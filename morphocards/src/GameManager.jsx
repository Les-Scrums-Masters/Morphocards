import React from 'react';
import CardPlacement from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import App from './App'
import Firebase from './Firebase'
import './css/index.css'

import Loading from './components/Loading';
//import Loading from './components/Loading';

export default class GameManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      handCards:[],
      words:[]
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

    let words = await Firebase.getWords();


    this.setState(
      {handCards:handCards,
      words:words}
    );
  }

  render() {
    if(this.state.handCards.length === 0 && this.state.words.length === 0 ){
      return (
        <Loading />
      )
    } else{
      return(<App handCards={this.state.handCards} boardItems={this.boardItems} />);
    }
  }

}
