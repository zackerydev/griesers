import React, { Component } from 'react'
import { List, Card, Table, Button} from 'semantic-ui-react'
import fb from '../fb.js'

export default class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
      players: props.players,
      logged: props.logged
    };
    this.handlePaid = this.handlePaid.bind(this);
	}
	componentWillMount() {
    var self = this;
    // fb.auth().onAuthStateChanged(function(user) {
    //   if(user) {
    //     self.setState({logged: true});
    //   }
    // })
    // let playersRef = fb.database().ref('picks');
    // playersRef.on('value', function(snapshot) {
		// 	self.setState({players: snapshot.val()})
		// })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({logged: nextProps.logged, players: nextProps.players});
  }

  handlePaid(val, idx, e) {
    var newPlayers = this.state.players;
    newPlayers[idx].paid = !newPlayers[idx].paid;
    fb.database().ref('picks').set(newPlayers, function(err) {
				if(err) {
                console.log(err)
                alert(err)
            }
			})
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
      <Table.Cell>
        <Button toggle disabled={!this.state.logged} active={val.paid} onClick={(e) => this.handlePaid(val, idx, e)} color={val.paid ? 'green' : 'red'}>
          {val.paid ? 'Yes' : "No"}
        </Button>
      </Table.Cell>
      </Table.Row>
      )
    })
		return (<div style={{fontSize: "24px"}}> 
			<Card className="card" fluid>
        <Card.Content header="Players" />
        <Card.Content>
        <Table basic='very'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell><b>Name</b></Table.HeaderCell>
              <Table.HeaderCell><b>Points</b></Table.HeaderCell>
              <Table.HeaderCell><b>Paid</b></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {pList}
          </Table.Body>      
        </Table>
        </Card.Content>
      </Card>
        
        
        </div>)
	}
}