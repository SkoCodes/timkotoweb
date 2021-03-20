import React from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';
import settings from '../../settings';
import adapter from '../../utils/adapter';
import { Container, TextField, Button } from '@material-ui/core';
import Message from '../common/Message';
class AgentPlayers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playersList: [],
            filteredPlayersList: [],
            message: "",
            messageType:""
        }
    }

    async componentDidMount() {
        const currentUser = authenticationService.getCurrentUser();
        const url = `${settings.apiRoot}/api/v1/player/${currentUser.operatorId}/${currentUser.id}`;
        const response = await adapter.Get(url);

        if (!response.ok) {
            this.setState({
                message : "Unable to retrieve list of players.",
                messageType : "error"
            })        
        } else {
            const result = await response.json();;
            this.setState({
                playersList: result.data.players,
                filteredPlayersList: result.data.players
            });
        }
    }

    searchPlayer = (e) => {
        const searchText = e.target.value;
        const filteredPlayerList = this.state.playersList.filter(player => searchText !== "" ?
            player.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            player.email.toLowerCase().includes(searchText.toLowerCase()) :
            player)
        this.setState({
            filteredPlayersList: filteredPlayerList
        })
    }

    render() {
        const filteredPlayersList = this.state.filteredPlayersList;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                    <div id="menu">
                        <Link to="/agent/players">Players</Link>
                        <Link to="/agent/player/points">Player Points</Link>
                    </div>
                    <div>
                        <Message text={this.state.message} messageType={this.state.messageType} />
                        <TextField
                            id="searchPlayer"
                            onChange={this.searchPlayer}
                            label="Search Player"
                            variant="outlined"
                        />

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayersList.map((player, index) =>
                                    <tr key={index}>
                                        <td><Link to ={`/agent/player/points/${player.id}`}>{player.userName}</Link></td>
                                        <td>{player.email}</td>
                                        <td>{player.phoneNumber}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={"/login"}
                            fullWidth>
                            Generate Registration Link</Button>
                    </div>
                </Container>
            </div>
        )
    }
}

export default AgentPlayers;