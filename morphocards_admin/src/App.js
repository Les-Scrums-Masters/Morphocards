import './css/index.css';
import HandCards from './components/handcards/HandCards';
import Words from './components/words/Words';
import React from 'react';
import Firebase from './Firebase';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLogged: false};
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
    })
  }

  render() {

    let content;
    if(this.state.isLogged) {
      content = (
          <div className="wrapper">
            <HandCards/>
            <Words />
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
