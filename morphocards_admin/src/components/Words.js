import React, { createRef } from 'react';
import Firebase from '../Firebase';
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
                <AddWord refresh={this.refreshList} />
                <WordList ref={this.listComponent} />
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
                        return(<WordItem element={item} key={item.id} />);
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

    }

    render() {
        return(
            <li className="word-item">
                <header>
                    <p>{this.props.element.id}</p>
                    <button className="delete-btn">x</button>
                </header>
                <div className="word-description">
                    <WordDescription data={this.props.element.cards} />
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

                let style = (isBoard) ? "" : "hand";

                return(<p key={value} className={style}>{value}</p>);
            }
        );
    }

}

class AddWord extends React.Component {

    constructor(props) {
        super(props);

        this.state = {id: "", cards: [], loading: false};

        this.handleCards = this.handleCards.bind(this);
        this.handleId = this.handleId.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.addBoardCard = this.addBoardCard.bind(this);
        this.addHandCard = this.addHandCard.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
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
                state.cards.push({isBoard: false, value: ""})
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

    deleteItem(e) {
        e.preventDefault();
        let index = e.target.getAttribute('index');
        let deleted = false;
        this.setState(
            (state, props) => {
                if(!deleted) {
                    state.cards.splice(index, 1)
                    deleted=true;
                    return {cards: state.cards};
                }
            }
        )
    }

    async submitForm(e) {

        try {
            this.setState({loading: true});
            e.preventDefault();

            if (!this.state.id || !this.state.cards || this.state.cards.length < 2) {
                throw new Error("Veuillez remplir tout les champs et ajouter au moins deux cartes !");
            }

            // UPLOAD TO FIREBASE

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
                                    (element, index) => (<CardItem key={index} index={index} isBoard={element['isBoard']} value={this.state.cards[index]['value']} handleChange={this.handleValue} delete={this.deleteItem}/>)
                                )
                            }
                        </ul>

                        <div className="btn-container">
                            <button className="btn" onClick={this.addBoardCard}>Ajouter une carte plateau</button>
                            <button className="btn" onClick={this.addHandCard}>Ajouter une carte main</button>
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

class CardItem extends React.Component {

    render() {

        let content;

        // if (this.props.isBoard) {
            content = (<input type="text" placeholder="valeur" value={this.props.value} onChange={this.props.handleChange} data-index={this.props.index}></input>);
        // } else {
        //     content = ();
        // }

        return(
            <li className="word-part">
                <p><span>#{this.props.index}</span> : <i>{(this.props.isBoard) ? "plateau" : "main"}</i></p>
                {content}
                <button className="delete-btn" data-index={this.props.index} onClick={this.props.delete}>x</button>
            </li>
        );
    }

}