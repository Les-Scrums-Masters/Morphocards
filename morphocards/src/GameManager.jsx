import React from 'react';
import GameContext from './GameContext'
import Firebase from './Firebase'
import './css/index.css'

import Loading from './components/Loading';

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
  }

  componentDidMount(){
    this.getData();
  }

  async getData(){
    let allHandCards = await Firebase.getHandCards();
    console.log(allHandCards)
    
    let words = await Firebase.getWords();

    this.setRandomListWords(words);
    this.setRandomListHandCards(allHandCards);

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
  setRandomListHandCards(allHandCards){
    //Une liste de toutes les mains de toutes les parties
    let handCardsList = [];
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ){

      //Liste des cartes main d'un seul round
      let handCards = [];

      //Ajout des cartes qui sont les bonnes réponses
      this.state.words[i].cards.map((card, index) => {
        if(!card.isBoard){
          handCards.push( this.getHandCard( card.value.id, allHandCards) )
        }
        return 0
      });

      //Rempli la main jusqu'à atteindre la taille de la main défini
      while(handCards.length < HAND_SIZE){
        handCards.push(this.getRandomCard(allHandCards, handCards));
      }

      //Mélange la main -> permet de ne pas avoir les bonnes cartes toujours au début
      shuffle(handCards);

      //Affection d'une position à chaque carte
      handCards.map( (card, index) =>(
        card.position = index
      ));

      handCardsList.push(handCards);
    }

    this.setState(
      {handCards:handCardsList}
    );
  }

  /*Fonction qui retourne une carte parmis allHandCards qui n'est pas inclus dans myHandCards
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         myHandCards : les cartes présent dans une des main
  */
  getRandomCard(allHandCards, myHandCards){
    let random = Math.floor(Math.random() * allHandCards.length);
    while(myHandCards.includes( allHandCards[random] )){
      random = Math.floor(Math.random() * allHandCards.length);
    }
    return allHandCards[random];
  }

   /*Fonction qui retourne la carte qui a la valeur "value"
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         value : valeur de la carte recherché
  */
  getHandCard(value, allHandCards){
    let i = 0;
    while(allHandCards[i].id !== value){
      i++
    }
    return allHandCards[i];
  }
  
  appWin() {

  }

  appFail(playerWord) {

  }

  render() {
    if(this.state.handCards.length === 0 && this.state.words.length === 0 ){
      return (
        <Loading />
      )
    } else{
      return(<GameContext handCards={this.state.handCards[ACTUAL_ROUND]} word={this.state.words[ACTUAL_ROUND]} />);
    }
  }

}


//mélange un tableau
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
