import React, { Component } from 'react'
import { List, Card, Form, Button, Radio, Header} from 'semantic-ui-react'
import { Dimmer, Loader, Image, Segment, Table, Message} from 'semantic-ui-react'
import "./css/PickList.css"
import pg from "../images/paragraph.png"
import fb from '../fb.js'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

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
			players: props.players,
			games: props.games
		};
		this.submitPicks = this.submitPicks.bind(this)
	}
	componentWillMount = () => {
		var self = this;
		let bowlGamesRef = fb.database().ref('games')
        bowlGamesRef.on('value', function(snapshot) {
			self.setState({bowlGames: snapshot.val(), loaded: true})
		})
		

	}

	componentWillUnmount = () => {
		fb.database().ref('games').off()
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
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		var self = this
		this.setState({error: true, message: "Picking games is closed!"})
		
	}
	render() {
		const { players } = this.state
		const { games } = this.state
		const headItems = [{
			Header: "Name",
			accessor: 'name'
		}]
		for(var i = 0; i < games.length; i++) {
			headItems.push({
				Header: games[i].name,
				accessor: 'picks[' + i + ']',
			})
		}
		const listItems = players.map((val, idx) => {
			return(
				<Table.Row key={idx}>
					<Table.Cell>
						{val.name}
					</Table.Cell>
					{
						val.picks.map((v, idx) => {
							return(<Table.Cell>
								{v}
							</Table.Cell>)
							
						})
					}
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
				<ReactTable data={this.state.players} columns={headItems}/>
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