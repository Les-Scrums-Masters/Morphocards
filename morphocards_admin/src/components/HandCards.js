import React from 'react';
import Firebase from '../Firebase';
import Loading from './Loading';
import NoResult from './NoResults';
import HandCardModel from '../models/HandCardModel';

class HandCards extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.refreshList = this.refreshList.bind(this);
    // }

    render() {
        return(
            <div className="card" id="Handcards">
                <h3>Cartes </h3>
                <AddHandCard refresh={this.props.refresh} />
                <CardList handcards={this.props.handcards} refresh={this.props.refresh}/>
            </div>
        );
    }

}

export default HandCards;

class AddHandCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {id:'', value:'', loading: false};

        this.handleId = this.handleId.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleId(e) {
        this.setState({id: e.target.value});
    }

    handleValue(e) {
        this.setState({value: e.target.value});
    }

    async submitForm(e) {

        try {
            this.setState({loading: true});

            e.preventDefault();
    
            if (!this.state.value || !this.state.id) {
                throw new Error("Veuillez remplir tous les champs");
            }
    
            await Firebase.addHandCard(new HandCardModel(this.state.id, this.state.value));
    
            this.props.refresh();

            this.setState({id: '', value:''});

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
                        <label htmlFor="addhandcard-id">ID</label>
                        <input type="text" name="id" id="addhandcard-id" placeholder="id" required value={this.state.id} onChange={this.handleId}/>
                    </div>

                    <div>
                        <label htmlFor="addhandcard-value">Valeur</label>
                        <input type="text" name="value" id="addhandcard-value" placeholder="value" required value={this.state.value} onChange={this.handleValue}/>
                    </div>

                    <input type="submit" className="btn" id="addhandcard-submit" value="Ajouter"/>

                </form>
            );
        }

        return(
            <div className="card-add">
                <h6>Ajouter une carte main</h6>
                {content}                
            </div>
        );
    }

}

class CardList extends React.Component {

    render() {

        let data = this.props.handcards;

        let content;
        if (data == null) {
            content = <Loading />;      
        } else if (data.length === 0) {
            content = <NoResult />;
        } else {
            content = data.map((element) => <HandCardItem element={element} key={element.id} refreshList={this.props.refresh}/>);
        }

        return(
            <ul>{content}</ul>
        );
    }
}

class HandCardItem extends React.Component {

    constructor(props) {
        super(props);

        this.deleteItem = this.deleteItem.bind(this);
    }

    async deleteItem() {
        let item = this.props.element
        await Firebase.removeHandCards(item);
        this.props.refreshList();
    }

    render() {
        return(
            <li className="card-element">
                <p><b>{this.props.element.id}</b><span>{this.props.element.value}</span></p>
                <button className="btn btn-delete" onClick={this.deleteItem}>x</button>
            </li>
        );
    }

}