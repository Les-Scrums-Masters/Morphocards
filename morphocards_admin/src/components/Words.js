import React, { createRef } from 'react';
import Firebase from '../Firebase';
import WordModel from '../models/WordModel';
import Loading from './Loading';
import NoResult from './NoResults';
//import Firebase from './Firebase';

export default class Words extends React.Component {

    constructor(props) {
        super(props);
        
        this.listComponent = createRef();

        this.refreshList = this.refreshList.bind(this);
    }

    refreshList() {
        this.listComponent.current.refresh();
    }

    render() {
        return(
            <div className="card" id="Words">
                <h3>Mots</h3>
                <AddWord refresh={this.refreshList} handcards={this.props.handcards}/>
                <WordList ref={this.listComponent} handcards={this.props.handcards} refresh={this.refreshList}/>
            </div>
        );
    }
}

class WordList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {data: null};

        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    async refresh() {
        let list = await Firebase.getWords();
        this.setState({data: list});
    }

    render() {

        if (this.state.data == null) {
            return( <Loading />);
        } else if (this.state.data.length === 0) {
            return( <NoResult />);
        } else {
            return(
                <ul>
                    {this.state.data.map((item) => {
                        return(<WordItem element={item} key={item.id} handcards={this.props.handcards} refresh={this.props.refresh}/>);
                    })}
                </ul>);
        }

    }
}

class WordItem extends React.Component {

    constructor(props) {
        super(props);

        this.delete = this.delete.bind(this);
    }

    async delete() {
        await Firebase.removeWord(this.props.element);
        this.props.refresh();
    }

    render() {
        return(
            <li className="word-item">
                <header>
                    <p>{this.props.element.id}</p>
                    <button className="btn btn-delete" onClick={this.delete}>x</button>
                </header>
                <div className="word-description">
                    <WordDescription data={this.props.element.cards} handcards={this.props.handcards}/>
                </div>
                
            </li>
        );
    }

}

class WordDescription extends React.Component {

    render() {
        return this.props.data.map(
            (element, index) => {

                let isBoard = element['isBoard'];

                let value = (isBoard) 
                    ? element['value']
                    : Firebase.refToString(element['value']);

                let content;
                
                if (isBoard) {
                    content = value;
                } else {
                    let cardItem = this.props.handcards.filter(item => item.id === value)[0];

                    let cardValue = (cardItem)
                        ? cardItem['value']
                        : "..."

                    content = value + "(" + cardValue + ")"
                }
                
                let style = (isBoard) ? "" : "hand";

                return(<p key={value} className={style}>{content}</p>);
            }
        );
    }

}

class AddWord extends React.Component {

    constructor(props) {
        super(props);

        this.state = {loading: false, cards: [], id: ''};

        this.handleCards = this.handleCards.bind(this);
        this.handleId = this.handleId.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.addBoardCard = this.addBoardCard.bind(this);
        this.addHandCard = this.addHandCard.bind(this);
        this.reset = this.reset.bind(this);
    }

    addBoardCard(e) {
        e.preventDefault();
        let added = false;
        this.setState(function(state, props) {
            if (!added) {
                state.cards.push({isBoard: true, value: ""})
                added=true;
                return {
                    cards: state.cards
                };
            }
        });
    }

    addHandCard(e) {
        e.preventDefault();
        let added = false;
        this.setState(function(state, props) {
            if (!added) {
                state.cards.push({isBoard: false, value: this.props.handcards[0].id});
                added=true;
                return {
                    cards: state.cards
                };
            }
        });
    }

    handleId(e) {
        this.setState({id: e.target.value});
    }

    handleCards(e) {
        this.setState({cards: []});
    }

    handleValue(e) {
        let changed = false;
        let index = e.target.getAttribute("data-index");
        this.setState(function(state, props) {
            if(!changed) {
                state.cards[index]['value'] = e.target.value;
                changed = true;
                return({cards: state.cards});
            }
        });
    }

    reset(e) {
        e.preventDefault();
        this.setState({cards: []});
    }

    async submitForm(e) {

        try {
            this.setState({loading: true});
            e.preventDefault();

            if (!this.state.id || !this.state.cards || this.state.cards.length < 2) {
                throw new Error("Veuillez remplir tout les champs et ajouter au moins deux cartes !");
            }

            // UPLOAD TO FIREBASE
            await Firebase.addWord(new WordModel(this.state.id, this.state.cards));

            this.props.refresh();

            this.setState({id: '', cards: []});

        } catch (e) {
            console.error(e);
            alert(e);
        } finally {
            this.setState({loading: false});
        }

    }

    render() {

        if (this.props.handcards.length === 0) {
            return (<p>Vous devez ajouter des cartes main afin de pouvoir ajouter un mot !</p>);
        } else {
            let content;

        if (this.state.loading) {
            content = (<Loading />);
        } else {
            content = (
                <form onSubmit={this.submitForm}>

                    <div>
                        <label htmlFor="addword-id">Mot</label>
                        <input type="text" id="addword-id" placeholder="Mot" required value={this.state.id} onChange={this.handleId} />
                    </div>
                    
                    <section>
                        <label>Composition :</label>

                        <ul>
                            {
                                this.state.cards.map(
                                    (element, index) => (<CardItem key={index} index={index} isBoard={element['isBoard']} value={this.state.cards[index]['value']} handleChange={this.handleValue} handcards={this.props.handcards} />)
                                )
                            }
                        </ul>

                        <div className="btn-container">
                            <button className="btn" onClick={this.addBoardCard}>Ajouter une carte plateau</button>
                            <button className="btn" onClick={this.addHandCard}>Ajouter une carte main</button>
                            <button className="btn btn-delete" onClick={this.reset}>Supprimer</button>
                        </div>
                    </section>

                    <input type="submit" className="btn" id="addhandcard-submit" value="Ajouter"/>
                </form>
            );
        }

        return(
            <div className="card-add">
                <h6>Ajouter un mot</h6>
                {content}
            </div>
        );
        }

    }

}

class CardItem extends React.Component {

    render() {

        let content;

        if (this.props.isBoard) {
            content = (
                <input type="text" placeholder="valeur" value={this.props.value} onChange={this.props.handleChange} data-index={this.props.index}></input>
            );
        } else {
            content = (
                <select value={this.props.value} onChange={this.props.handleChange} data-index={this.props.index}>
                    {this.props.handcards.map(
                        (element, index) => (
                            <option key={element.id} value={element.id}>{element.id} ({element.value})</option>
                        )
                    )}
                </select>
            );
        }

        return(
            <li className="word-part">
                <p><span>#{this.props.index}</span> : <i>{(this.props.isBoard) ? "plateau" : "main"}</i></p>
                {content}
                {/* <button className="delete-btn" data-index={this.props.index} onClick={this.props.delete}>x</button> */}
            </li>
        );
    }

}