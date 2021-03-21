import React, { useState, useEffect } from 'react';
import '../css/Agent.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Navbar from '../common/Navbar';
import LoadingTable from '../common/LoadingTable';
import { useHistory } from 'react-router-dom';
import { Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';

export default function AgentPlayers() {
    const history = useHistory();
    const [players, setPlayers] = useState([]);
    const [players2, setPlayers2] = useState([]);
    const [userDetail, setUserDetail] = useState('');
    const [search, setSearch] = useState('');
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const currentUser = authenticationService.getCurrentUser();
            setUserDetail(currentUser)

            setFetching(true)
            const url = `${settings.apiRoot}/api/v1/player/${currentUser.operatorId}/${currentUser.id}`;
            const response = await adapter.Get(url);
            if (response.ok) {
                const jsonResponse = await response.json();            
                setPlayers(jsonResponse.data.players)
                setPlayers2(jsonResponse.data.players)
                setFetching(false)
            }
        }

        fetchData();
    }, []);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value)
        const filter = players2.filter(player => e.target.value !== "" ?
            player.userName.toLowerCase().includes(e.target.value) || player.email.toLowerCase().includes(e.target.value.toLowerCase())
            : player)
        setPlayers(filter)
    }

    const handleRedirect = (player) => {
        sessionStorage.setItem('agent-player-points', JSON.stringify(player));
        history.push('/agent/player-points/' + player.id)
    }


    return (
        <div>
            <Navbar userType={userDetail.role} title={"Players List"} />
            <Container maxWidth="md">
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <TextField onChange={handleChangeSearch} value={search} fullWidth id="outlined-basic" label="Search Player" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetching ?
                            <LoadingTable />
                            :
                            <Table stickyHeader className="table-style">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Phone Number</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        players.length > 0 ?
                                            players.map((player, index) => (
                                                <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRedirect(player)}>
                                                    <TableCell align="left">{player.userName}</TableCell>
                                                    <TableCell align="left">{player.email}</TableCell>
                                                    <TableCell align="left">{player.phoneNumber}</TableCell>
                                                </TableRow>
                                            ))
                                            :
                                            <TableRow hover>
                                                <TableCell>No Data</TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>                            
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="outlined" onClick={() => history.push('/player/registration-link')}>Generate Registration Link</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
