import React, { createRef } from 'react';
import Firebase from '../../Firebase';
import HandCardItem from './HandCardItem';
import Loading from '../Loading';
import NoResult from '../NoResults';
import HandCardModel from '../../models/HandCardModel';

class HandCards extends React.Component {

    constructor(props) {
        super(props);
        this.refreshList = this.refreshList.bind(this);
        this.listComponent = React.createRef();
    }

    refreshList() {
        console.log("refresh list");
        this.listComponent.current.getData();
    }

    render() {
        return(
            <div className="card" id="Handcards">
                <h3>Cartes </h3>
                <AddHandCard refresh={this.refreshList}/>
                <CardList ref={this.listComponent} />
            </div>
        );
    }

}

export default HandCards;

class AddHandCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {id:'', value:''};

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
        e.preventDefault();

        if (!this.state.value || !this.state.id) {
            alert("Veuillez remplir tous les champs");
        }

        await Firebase.addHandCard(new HandCardModel(this.state.id, this.state.value));

        this.props.refresh();
    }

    render() {
        return(
            <div className="card-add">
                <form onSubmit={this.submitForm}>

                    <h6>Ajouter une carte main</h6>

                    <div>
                        <label htmlFor="addhandcard-id">ID</label>
                        <input type="text" name="id" id="addhandcard-id" placeholder="id" required value={this.state.id} onChange={this.handleId}/>
                    </div>

                    <div>
                        <label htmlFor="addhandcard-value">Valeur</label>
                        <input type="text" name="value" id="addhandcard-value" placeholder="value" required value={this.state.value} onChange={this.handleValue}/>
                    </div>

                    <input type="submit" id="addhandcard-submit" value="Ajouter"/>

                </form>
            </div>
        );
    }

}

class CardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: null};

        this.getData = this.getData.bind(this);

    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        let data = await Firebase.getHandCards();
        this.setState({list: data});
    }

    render() {

        let content;
        if (this.state.list == null) {
            content = <Loading />;      
        } else if (this.state.list.length === 0) {
            content = <NoResult />;
        } else {
            content = this.state.list.map((element) => <HandCardItem element={element} key={element.id}/>);
        }

        return(
            <ul>{content}</ul>
        );
    }
}