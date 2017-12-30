import React, { Component } from 'react';
import './App.css';
import Players from './components/Players'
import PickList from './components/PickList'
import { Menu, Segment, Header, Icon, Modal, Button, Form, Message, Image, Table, Dimmer, Loader } from 'semantic-ui-react'
import Home from './components/Home'
import Admin from './components/Admin'
import fb from './fb.js'
import logo from './images/horizontal-logo.svg'
import pg from "./images/paragraph.png"


  
class App extends Component {
  constructor() {
    super()
    this.state = {
      popover: false,
      activeItem: 'home',
      logged: false,
      password: "",
      username: "",
      players: []
    }
    this.openModal = this.openModal.bind(this);
  }
  componentWillMount = () => {
    var self = this;
    fb.auth().onAuthStateChanged(function(user) {
      if(user) {
        self.setState({logged: true, modalOpen: false});
      }
    })
    let playersRef = fb.database().ref('picks');
    playersRef.on('value', function(snapshot) {
      let players = snapshot.val();
      let winnersRef = fb.database().ref('winners');
      winnersRef.on('value', function(snapshot) {
        let winners = snapshot.val();
        let gamesRef = fb.database().ref('games');
        gamesRef.on('value', function(snapshot) {
          var games = snapshot.val()
          for(var i = 0; i < players.length; i++) {
            players[i].points = 0;
              for(var j = 0; j < players[i].picks.length; j++) {
                  if(players[i].picks[j] === winners[j]) {
                      var game = games[j];
                      if(winners[j] === game.favorite) {
                        players[i].points = parseInt(game.favPoints) + parseInt(players[i].points);
                      } else if(winners[j] === game.underdog) {
                        players[i].points = parseInt(game.undPoints) + parseInt(players[i].points);
                      }
                  }
              }
          }


          self.setState({players: players, games: snapshot.val(), winners: winners, loaded: true});
        })
      })
		})
    
  }

  componentWillUnmmount = () => {
    
  }
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  handleMenu = (event) => {
    event.preventDefault();
    this.setState({
      popover: true,
      panchor: event.currentTarget
    })
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleChange = (e, { value }) => this.setState({ password: value })
  handleUser = (e, { value }) => this.setState({ username: value })

  openModal = () => {
    if(this.state.logged) {
      this.setState({modalOpen: false, activeItem: 'admin'})
    } else {
      this.setState({modalOpen: true})
    }
  }

  handleSubmit = () => {
    var self = this;
    fb.auth().signInWithEmailAndPassword(self.state.username, self.state.password).catch(function(err) {
      self.setState({error: true, message: err.message});
    })
    this.setState({activeItem: 'admin'})
  }

  handleClose = () => {
    this.setState({modalOpen: false});
  }

  render() {
    
    const { activeItem } = this.state  
    let content;
    if(!this.state.loaded) {
      content = <Segment>
          <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
          </Dimmer>

          <Image src={pg} />
          </Segment>
    } else {
      if(activeItem === 'home') {
        content = <Home players={this.state.players} games={this.state.games} winners={this.state.winners} />
      } else if (activeItem === 'Players') {
        content = <Players logged={this.state.logged} players={this.state.players} />
      } else if(activeItem === 'picks') {
        content = <PickList players={this.state.players} games={this.state.games} />
      } else if(this.state.logged && activeItem === 'admin') {
        content = <Admin />
      }
    }
    return (
      <div style={{maxWidth: "1200px", margin: "auto"}}>
      
      <Segment inverted>
      
      <Menu inverted pointing secondary stackable size="large">
        <Menu.Item>
        <Image  src={logo}  alt="logo"/>
        {/* <Header as='h3' style={{color: "white"}}>Griesers</Header> */}
        </Menu.Item>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item name='Players' active={activeItem === 'Players'} onClick={this.handleItemClick} />
        <Menu.Item name='picks' active={activeItem === 'picks'} onClick={this.handleItemClick} />
        <Menu.Item position='right' active={activeItem === 'admin'} name='setting' onClick={this.openModal}>
          <Icon name='setting' size="large" />
        </Menu.Item>
      </Menu>
    </Segment>
      {content}

      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='privacy' content='Admin' />
        <Modal.Content>
          <h3>Please enter username and password to access the admin page</h3>
          <Form error={this.state.error}>
          <Message
            error
            header='Log In Failed'
            content={this.state.message}
          />
          <Form.Input label="Username" onChange={this.handleUser} />
          <Form.Input label="Password" type="Password" onChange={this.handleChange} /> 
          </Form>
        </Modal.Content>
        <Modal.Actions>
        <Button color='red' onClick={this.handleClose} inverted>
            <Icon name='remove' /> Cancel
          </Button>
          <Button color='blue' onClick={this.handleSubmit} inverted>
            <Icon name='checkmark' /> Submit
          </Button>
        </Modal.Actions>
      </Modal>
      </div>
    );
  }
}

export default App;
