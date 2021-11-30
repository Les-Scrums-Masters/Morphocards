import React from 'react';
import CardPlacement from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import App from './App'
import Firebase from './Firebase'
import './css/index.css'

import Loading from './components/Loading';
//import Loading from './components/Loading';

const GLOBAL_ROUND = 3;
let ACTUAL_ROUND = 0;
let HAND_SIZE = 6;

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

    this.setRandomListWords(words);

    this.setState(
      {handCards:handCards}
    );

    this.setRandomListHandCards();


  }


//Envoie un mot qui n'as pas déjà été selectionner
  getRandomWord(allWords){
    let random = Math.floor(Math.random() * allWords.length);
    while(this.state.words.includes( allWords[random] )){
      random = Math.floor(Math.random() * allWords.length);
    }
    return allWords[random];
  }


  /*Procédure qui permet de remplir la variable de state : words
  * Qui contiendra une liste de mot qui correspondront pour chaque partie
  *         le mot attendu à la ième partie

  * param : allWords : tout les mots de notre base de données
  */
  setRandomListWords(allWords){
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ){
      this.state.words.push( this.getRandomWord(allWords) );
    }
  }


  /*Procédure qui permet de remplir la variable de state : handCards
  * Qui contiendra une liste de liste de "cartes main" qui correspondront pour chaque partie
  *         la main du joueur à la ième partie
  *
  *
  * param : allWords : tout les mots de notre base de données
  */
  setRandomListHandCards(){
    let handCardsList = [];
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ){

      //Récupère le nombre de trous qu'il y a dans le mot
      let nbEmplacement = 0;
      this.state.words[i].cards.map( (card) => {
        console.log(card);
        if(card.isBoard){
          nbEmplacement++;
        }
      });
      console.log(nbEmplacement);

    }
  }

  render() {
    if(this.state.handCards.length === 0 && this.state.words.length === 0 ){
      return (
        <Loading />
      )
    } else{
      return(<App handCards={this.state.handCards} word={this.state.words[ACTUAL_ROUND]} />);
    }
  }

}
