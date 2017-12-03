import React, { Component } from 'react'
import { List, Card, Form, Button, Radio, Header} from 'semantic-ui-react'
import { Dimmer, Loader, Image, Segment, Table, Message} from 'semantic-ui-react'
import "./css/PickList.css"
import pg from "../images/paragraph.png"
import fb from '../fb.js'

export default class PickList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bowlGames: [],
			picks: [],
			error: false,
			message: "",
			loaded: false,
			name: "",
			players: []
		};
		this.submitPicks = this.submitPicks.bind(this)
	}
	componentWillMount = () => {
		var self = this;
		let bowlGamesRef = fb.database().ref('games');
		let playersRef = fb.database().ref('picks');

        bowlGamesRef.on('value', function(snapshot) {
			self.setState({bowlGames: snapshot.val(), loaded: true})
		})
		
		playersRef.on('value', function(snapshot) {
			self.setState({players: snapshot.val()})
		})
	}
	handleChange = (idx, value, e) => {
		let picks = this.state.picks;
		picks[idx] = e.target.value;
		this.setState({picks: picks})
	}

	handleName = (e) => {
		this.setState({name: e.target.value});
	}
	submitPicks = (e) => {
		var self = this
		let valid = true;
		for(var i = 0; i < this.state.players.length; i++ ){
			if(this.state.name === this.state.players[i].name) {
				this.setState({error: true, message: "Name already exists!"})
				valid = false;
				break;
			}
		}
		if(valid) {
			for(var i = 0; i < this.state.picks.length; i++) {
				if(typeof this.state.picks[i] === "undefined") {
					valid = false;
					this.setState({error: true, message: "Make sure you have picked all games!"})
					break;
				}
			}
		}

		if(valid) {
			if(this.state.picks.length !== this.state.bowlGames.length) {
				valid = false;
				this.setState({error: true, message: "Make sure you have picked all games!"})
			}
		}
			
		if(valid) {
			var newPicks = this.state.players;
			newPicks.push({
				name: this.state.name,
				picks: this.state.picks,
				points: 0
			});
			fb.database().ref('picks').set(newPicks, function(err) {
				if(err) {
                self.setState({error: true, message: err.message});
            } else {
                self.setState({success: true, message: "Successfully saved your picks!"})
            }
			})
		}
		
	}
	render() {
		const { bowlGames } = this.state
		const listItems = bowlGames.map((val, idx) => {
			return(
				<Table.Row key={idx}>
					<Table.Cell>
						{val.name}
					</Table.Cell>
					<Table.Cell>
						<input id={idx + "id"} type="radio" className="not"  name={idx.toString()} value={val.favorite} onChange={(e) => this.handleChange(idx, 'favorite', e)} />
						<label className="special" htmlFor={idx + "id"}> {val.favorite} </label>
					</Table.Cell>
					<Table.Cell>
						{val.favPoints}
					</Table.Cell>
					<Table.Cell> 
						<input type="radio" id={idx + "id2"} className="not"  name={idx.toString()} value={val.underdog} onChange={(e) => this.handleChange(idx, 'underdog', e)} />
						<label className="special" htmlFor={idx + "id2"}> {val.underdog} </label>
					</Table.Cell>
					<Table.Cell>
						{val.undPoints}
					</Table.Cell>
				</Table.Row>
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
            content = (<div style={{fontSize: "18px"}}>
			<Card.Group>
            <Card fluid>
                <Card.Content header="Make Your Picks!" />
                <Card.Content>
				{status}
				<Form>
				<Form.Input onChange={(e) => this.handleName(e)} label='Your Name' placeholder={"Clark Griswald"} />
				</Form>
				<Table basic='very'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell><b>Bowl Game</b></Table.HeaderCell>
						<Table.HeaderCell><b>Favorite</b></Table.HeaderCell>
						<Table.HeaderCell><b>Points</b></Table.HeaderCell>
						<Table.HeaderCell><b>Underdog</b></Table.HeaderCell>
						<Table.HeaderCell><b>Points</b></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
                    {listItems}
				</Table.Body>
				</Table>
                <Button color="blue" fluid onClick={this.submitPicks}> Save Your Picks! </Button>
                </Card.Content>
            </Card>
            
            </Card.Group>
        </div>)
        }
		return (<div> 
			{content}
        </div>)
	}
}