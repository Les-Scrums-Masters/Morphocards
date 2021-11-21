import './css/index.css';
import HandCards from './components/HandCards';
import Words from './components/Words';
import React from 'react';
import Firebase from './Firebase';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLogged: false, handcards: []};

    this.getData = this.getData.bind(this);

  }

  componentDidMount() {
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        // LOGGED
        this.setState({isLogged: true});
      } else {
        // PAS LOGGED :
        this.setState({isLogged: false});
      }
    });

    this._ismounted = true;
    this.getData();
  }

  componentWillUnmount() {
      this._ismounted = false;
  }


  async getData() {
    if  (this._ismounted) {
      let data = await Firebase.getHandCards();
      this.setState({handcards: data});
    }
  }  

  render() {

    let content;
    if(this.state.isLogged) {
      content = (
          <div className="wrapper">
            <HandCards handcards={this.state.handcards} refresh={this.getData}/>
            <Words handcards={this.state.handcards}/>
          </div>
        );
    } else {
      content = (<LoginPage />);
    }

    return (
      <div className="App">
        <Navbar isLogged={this.state.isLogged} />
        {content}
      </div>
    );
  }
  
}
