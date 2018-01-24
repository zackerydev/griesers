import React, { Component } from 'react'
import { List, Card, Table, Button, Icon} from 'semantic-ui-react'
import fb from '../fb.js'
import "./css/Home.css"

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
        let place = 0;
        let displayPlace = 1;
        let currentPoints = this.state.players[0].points;
        const pList = this.state.players.map((val, idx) => {
            place++
            if(currentPoints > val.points) {
                displayPlace = place;
                currentPoints = val.points
            }
            return (<Table.Row key={idx}>
            <Table.Cell collapsing>
                {displayPlace}
            </Table.Cell>
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

            {/* <Card fluid>
                <Card.Content header="How It Works" />
                <Card.Content>
                <p> Once the games go live go to the picks tab above. Enter your name and pick your games. You can pay at the PayPal link below. The players tab
                above will show your payment status once it has been received and processed. <b> Note: </b> Once you make your picks you cannot change them through the site.  </p>
                <a href="https://paypal.me/pools/c/7ZRJF1scA6">
                <Button fluid animated="fade" color="blue">
                    <Button.Content visible> <Icon name="paypal"  /> PayPal </Button.Content>
                    <Button.Content hidden> Click Here To Pay! </Button.Content>
                </Button>
                </a>
                </Card.Content>
            </Card> */}
            <Card.Group>
            <Card fluid>
            <Card.Content header="Payout" />
            <Card.Content>
              <b> Better late than never: </b> You can go to the 'Games' tab to see how anyone's picks stack up against the winners

            <Card.Meta style={{padding: "10px"}}> 47 total entries </Card.Meta>
            <ol>
            <li> 1st - $235 - <b> Tina Franklin </b> </li>
            <li> 2nd - $120 - <b> BOSS </b></li>
            <li> 3rd - $70 - <b> Brian Wilson (Mandi Wilson) </b></li>
            <li> 4th - $35 - <b> Donna Kletting </b> </li>
            <li> Last - $10 - <b> KEN GREEN 1 </b> </li>
            </ol>
            </Card.Content>
            </Card>
            <Card fluid>
                <Card.Content header="Leaderboard" />
                <Card.Content>
                <Table padded unstackable>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                        <Table.HeaderCell collapsing><b>Name</b></Table.HeaderCell>
                        <Table.HeaderCell collapsing><b>Points</b></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="tbody">
                    {pList}
                    </Table.Body>
                </Table>
                </Card.Content>
            </Card>
            </Card.Group>


        </div>)
	}
}
