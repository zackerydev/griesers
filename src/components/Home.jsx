import React, { Component } from 'react'
import { List, Card, Table, Button, Icon} from 'semantic-ui-react'
import fb from '../fb.js'


function compare(a,b) {
  if(a.points > b.points) {
    return -1
  } else if(a.points < b.points) {
    return 1
  } else {
    return 0
  }
}
export default class Home extends Component {
	constructor(props) {
        super(props);
        var sortedPlayers = props.players.sort(compare);

		this.state = {
            players: sortedPlayers
		};
	}
    componentWillMount = () => {
        var self = this;
    }

    componentWillUnmount = () => {
    }
	render() {
        const pList = this.state.players.map((val, idx) => {
            return (<Table.Row key={idx}>
            <Table.Cell>
                {val.name} 
            </Table.Cell>
            <Table.Cell>
                {val.points} 
            </Table.Cell>
            </Table.Row>
            )
            })
		return (<div style={{fontSize: "24px"}}>
			<Card.Group >
            <Card fluid>
                <Card.Content header="How It Works" />
                <Card.Content>
                <p> Once the games go live go to the picks tab above. Enter your name and pick your games. Once you have 
                paid Steve or Spike using the PayPal link below you will be able to see your name show up on the Leaderboard. </p>
                <a href="https://paypal.me/pools/c/7ZRJF1scA6">
                <Button fluid animated="fade" color="blue">
                    <Button.Content visible> <Icon name="paypal"  /> PayPal </Button.Content>
                    <Button.Content hidden> Click Here To Pay! </Button.Content>
                </Button>
                </a>
                </Card.Content>
            </Card>
            <Card fluid>
                <Card.Content header="Leaderboard" />
                <Card.Content>
                <Table basic='very'>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell><b>Name</b></Table.HeaderCell>
                        <Table.HeaderCell><b>Points</b></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {pList}
                    </Table.Body>      
                </Table>
                </Card.Content>
            </Card>
            </Card.Group>
        </div>)
	}
}