import React from 'react';
//import Firebase from './Firebase';

class Words extends React.Component {

    constructor(props) {
        super(props);
        this.state = {list: null};
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        // let data = await Firebase.getHandCards();
        // this.setState({list: data});
    }

    render() {
        return(
            <div className="card" id="Words">
                <h3>Mots</h3>
                <ul>
                    
                </ul>
            </div>
        );
    }
}

export default Words;
