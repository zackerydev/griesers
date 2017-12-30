import React, { Component } from 'react'
import { List, Card, Table, Button, Input} from 'semantic-ui-react'
import fb from '../fb.js'

export default class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
      games: props.games,
      logged: props.logged,
			winners: props.winners,
			players: props.players,
			basic: true
    };
	}
	componentWillMount() {
    var self = this;
    // fb.auth().onAuthStateChanged(function(user) {
    //   if(user) {
    //     self.setState({logged: true});
    //   }
    // })
    // let gamesRef = fb.database().ref('picks');
    // gamesRef.on('value', function(snapshot) {
		// 	self.setState({games: snapshot.val()})
		// })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({logged: nextProps.logged, games: nextProps.games, winners: nextProps.winners, players: nextProps.players});
  }

	handleClick = (e) => {
		let worked;
		for(var i = 0; i < this.state.players.length; i++) {
			if(this.state.players[i].name === this.state.input) {
				worked = true;
				this.setState({chosen: this.state.players[i], basic: false})
			}
		}
		if(!worked)
			alert("Player not found")
	}

	handlePlayer = (e) => {
		this.setState({input: e.target.value})
	}

	render() {
    const pList = this.state.games.map((val, idx) => {
      return (<Table.Row key={idx}>
      <Table.Cell>
        {val.name}
      </Table.Cell>
      <Table.Cell positive={this.state.winners[idx] === val.favorite} error={this.state.winners[idx] !== val.favorite}>
        {val.favorite}
      </Table.Cell>
      <Table.Cell>
        {val.favPoints}
      </Table.Cell>
			<Table.Cell positive={this.state.winners[idx] === val.underdog} error={this.state.winners[idx] !== val.underdog}>
        {val.underdog}
      </Table.Cell>
			<Table.Cell>
        {val.undPoints}
      </Table.Cell>
      </Table.Row>
      )
    })
		let table;
		if(this.state.basic) {
			table = <Table basic='very'>
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
				{pList}
				</Table.Body>
			</Table>
		} else {
			const list = this.state.winners.map((val, idx) => {
				return <Table.Row>
					<Table.Cell>
						{this.state.games[idx].name}
					</Table.Cell>
					<Table.Cell>
						{this.state.winners[idx]}
					</Table.Cell>
					<Table.Cell>
						{this.state.winners[idx] === this.state.games[idx].favorite ? this.state.games[idx].favPoints : this.state.games[idx].undPoints}
					</Table.Cell>
					<Table.Cell positive={this.state.winners[idx] === this.state.chosen.picks[idx]} error={this.state.winners[idx] !== this.state.chosen.picks[idx]}>
						{this.state.chosen.picks[idx]}
					</Table.Cell>
				</Table.Row>
			})
			table = <Table basic='very'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell><b>Bowl Game</b></Table.HeaderCell>
						<Table.HeaderCell><b>Winner</b></Table.HeaderCell>
						<Table.HeaderCell><b>Points</b></Table.HeaderCell>
						<Table.HeaderCell><b>{this.state.chosen.name + "'s picks"}</b></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{list}
				</Table.Body>
			</Table>
		}

		return (<div>
			<Card className="card" fluid>
        <Card.Content header="Players" />
        <Card.Content>
					<div> Input a name of a player here to see how their picks matched up with the winners
					<Input style={{padding: "10px"}} placeholder='Player name...' size="tiny" onChange={this.handlePlayer}/>
					<Button primary onClick={this.handleClick}> Choose </Button></div>
					<div style={{fontSize: "20px"}}>
						{table}
					</div>


        </Card.Content>
      </Card>


        </div>)
	}
}
