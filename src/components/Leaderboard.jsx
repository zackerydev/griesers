import React, { Component } from 'react'
import { List, Card } from 'semantic-ui-react'
import fb from '../fb.js'

export default class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: []
		};
	}
	componentWillMount() {
    var self = this;
    let playersRef = fb.database().ref('picks');
    playersRef.on('value', function(snapshot) {
			self.setState({players: snapshot.val()})
		})
  }
	render() {
    const pList = this.state.players.map((val, idx) => {
      return (<List.Item key={idx}>
      <List.Content>
        <List.Header> {val.name} </List.Header>
      </List.Content>
      </List.Item>
      )
    })
		return (<div style={{fontSize: "24px"}}> 
			<Card className="card" fluid>
        <Card.Content header="Players" />
        <Card.Content>
        <List divided ordered>
          {pList}
        </List>
        </Card.Content>
      </Card>
        
        
        </div>)
	}
}