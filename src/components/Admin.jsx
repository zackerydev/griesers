import React, { Component } from 'react'
import { List, Card, Form, Button, Icon, Message } from 'semantic-ui-react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import pg from "../images/paragraph.png"
import fb from '../fb'

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
            error: false,
            success: false,
            bowlGames: []
		};
    }
    componentWillMount = () => {
        var self = this;
        let bowlGamesRef = fb.database().ref('games');
        bowlGamesRef.on('value', function(snapshot) {
            self.setState({bowlGames: snapshot.val(), loaded: true})
        })
    }
    handleChange = (idx, prop, event) => {
        let games;
        if(this.state.bowlGames[idx]) {
            games = this.state.bowlGames;
            games[idx][prop] = event.target.value
        } else {
            games = this.state.bowlGames;
            games[idx] = {
                [prop]: event.target.value
            }
        }

        this.setState({bowlGames: games})
    }
    saveGames = () => {
        var self = this;
        fb.database().ref('games').set(this.state.bowlGames, function(err) {
            if(err) {
                self.setState({error: true, message: err.message});
            } else {
                self.setState({success: true, message: "Successfully updated Bowl Games"})
            }
        })
    }
    addGame = (idx) => {
        let games = this.state.bowlGames;
        games.splice(idx+1, 0, {
            name: "",
            favorite: "",
            favPoints: "",
            underdog: "",
            undPoints: ""
        })
        this.setState({bowlGames: games})
    }

    removeGame = (idx) => {
        let games = this.state.bowlGames;
        games.splice(idx, 1);
        this.setState({bowlGames: games})
    }

	render() {
        let listItems = this.state.bowlGames.map((val, idx) => {
                    return(
                            <Form.Group key={idx}>
                            <Form.Input onChange={(e) => this.handleChange(idx, "name", e)} label='Bowl Game Name' placeholder={"Bowl Name"} value={val.name} />
                            <Form.Input onChange={(e) => this.handleChange(idx, "favorite", e)} label='Favorite' placeholder={"Favorite"} value={val.favorite} />
                            <Form.Input onChange={(e) => this.handleChange(idx, "favPoints", e)} label='Points' placeholder={"Favorite Points"} value={val.favPoints} type="number"/>
                            <Form.Input onChange={(e) => this.handleChange(idx, "underdog", e)} label='Underdog' placeholder={"Underdog"} value={val.underdog} />
                            <Form.Input onChange={(e) => this.handleChange(idx, "undPoints", e)} label='Points' placeholder={"Underdog Points"} value={val.undPoints} type="number"/>
                            <Form.Button label="Add" icon color="green" onClick={(e) => this.addGame(idx)}> <Icon name="plus" /></Form.Button>
                            <Form.Button label="Remove" icon color="red" onClick={(e) => this.removeGame(idx)}> <Icon name="minus" /></Form.Button>
                            </Form.Group>
                    )
                })
        let status = <div></div>
        if(this.state.success) {
            status = <Message positive>
                <Message.Header>Successfully saved Bowl Games!</Message.Header>
                {this.state.message}
            </Message>
        } else if(this.state.error) {
            status = <Message negative>
                <Message.Header>Error saving Bowl Games!</Message.Header>
                {this.state.message}
            </Message>

        }
        let content;
        if(!this.state.loaded) {
            content = <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>

                <Image src={pg} />
                </Segment>
        } else {
            content = (<div style={{fontSize: "24px"}}>
			<Card.Group>
            <Card fluid>
                <Card.Content header="Insert/Edit Bowl Games" />
                <Card.Content>
                {status}
                <Form>
                    {listItems}
                </Form>
                <Button color="blue" fluid onClick={this.saveGames}> Save Bowl Games </Button>
                </Card.Content>
            </Card>
            
            </Card.Group>
        </div>)
        }
		return (<div> {content} </div>)
	}
}