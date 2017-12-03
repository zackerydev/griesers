import React, { Component } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard'
import PickList from './components/PickList'
import * as firebase from 'firebase';
import { Menu, Segment, Header, Card, List, Icon, Modal, Button, Form, Message, Image } from 'semantic-ui-react'
import Logo from "./images/horizontal-logo.svg"
import Home from './components/Home'
import Admin from './components/Admin'
import fb from './fb.js'
import logo from './images/horizontal-logo.svg'

  
class App extends Component {
  constructor() {
    super()
    this.state = {
      popover: false,
      activeItem: 'home',
      logged: false,
      password: "",
      username: ""
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
  }

  componentWillUnmmount = () => {
    fb.auth().re
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
    if(activeItem === 'home') {
      content = <Home />
    } else if (activeItem === 'leaderboard') {
      content = <Leaderboard />
    } else if(activeItem === 'picks') {
      content = <PickList />
    } else if(this.state.logged && activeItem === 'admin') {
      content = <Admin />
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
        <Menu.Item name='leaderboard' active={activeItem === 'leaderboard'} onClick={this.handleItemClick} />
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
