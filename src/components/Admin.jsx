import React, { Component } from 'react'
import { List, Card, Form, Button, Icon, Message } from 'semantic-ui-react'
import { Dimmer, Loader, Image, Segment, Divider, Header } from 'semantic-ui-react'
import pg from "../images/paragraph.png"
import fb from '../fb'

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
            error: false,
            success: false,
            bowlGames: [],
            winners: []
		};
    }
    componentWillMount = () => {
        var self = this;
        let bowlGamesRef = fb.database().ref('games');
        bowlGamesRef.on('value', function(snapshot) {
            let games = snapshot.val();
            let winnersRef = fb.database().ref('winners');
            winnersRef.on('value', function(snapshot) {
                self.setState({bowlGames: games, loaded: true, winners: snapshot.val()})
            })
            
        })
    }
    componentWillUnmount = () => {
        fb.database().ref('games').off();
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

    setWinner = (idx, team) => {
        var self = this;
        let oldWin = this.state.winners;
        oldWin[idx] = team
        fb.database().ref('winners').set(oldWin, function(err) {
            if(err)
                self.setState({error: true, message: "An error occurred updating winners"})
            else {
                self.setState({success: true, message: "Saved winner!"})
            }

        })
    }

	render() {
        let { winners } = this.state
        let listItems = this.state.bowlGames.map((val, idx) => {
                    return(
                        <div>
                        <Header as='h3'> {val.name} </Header>
                        <Button.Group fluid>
                            <Button toggle active={this.state.winners[idx] === val.favorite} onClick={() => this.setWinner(idx, val.favorite)}>{val.favorite} </Button>
                            <Button toggle active={this.state.winners[idx] === val.underdog} onClick={() => this.setWinner(idx, val.underdog)}> {val.underdog} </Button>
                        </Button.Group>
                        <Divider />
                        </div>
                        
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
                <Card.Content header="Pick the Bowl Game Winners" />
                <Card.Content>
                {status}
                    {listItems}
                <Button color="blue" fluid onClick={this.saveGames}> Save Bowl Games </Button>
                </Card.Content>
            </Card>
            
            </Card.Group>
        </div>)
        }
		return (<div> {content} </div>)
	}
}