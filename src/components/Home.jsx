import React, { Component } from 'react'
import { List, Card } from 'semantic-ui-react'


export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (<div style={{fontSize: "24px"}}>
			<Card.Group >
            <Card fluid>
                <Card.Content header="How It Works" />
                <Card.Content>
                <p> Once the games go live go to the picks tab above. Enter your name and pick your games. Once you have 
                paid Steve or Spike using the PayPal link you will be able to see your name show up on the Leaderboard. </p>
                </Card.Content>
            </Card>
            <Card fluid>
                <Card.Content header="Leaderboard" />
                <Card.Content>
                </Card.Content>
            </Card>
            </Card.Group>
        </div>)
	}
}