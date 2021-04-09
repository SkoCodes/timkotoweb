import React, { useState, useEffect } from 'react';
import '../css/Agent.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Navbar from '../common/Navbar';
import LoadingTable from '../common/LoadingTable';
import { useHistory } from 'react-router-dom';
import { TableContainer, Paper, Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440
    },
    tableRow: {
        height: 30
      },
      tableCell: {
        padding: "1px 6px"
    },
    tableHead: {
        padding: "1px 6px",
        backgroundColor: "#5353c6",
        color: "white"
    }
  });

 
export default function AgentPlayersView() {
    const classes = useStyles();
    const history = useHistory();
    const [players, setPlayers] = useState([]);
    const [players2, setPlayers2] = useState([]);
    const [userDetail, setUserDetail] = useState('');
    const [search, setSearch] = useState('');
    const [fetching, setFetching] = useState(false);
    const [currentAgent, setCurrentAgent] = useState({});

    useEffect(() => {
        async function fetchData() {
            
            const agent = JSON.parse(sessionStorage.getItem('operator-selected-agent'))
            setCurrentAgent(agent);
            const currentUser = authenticationService.getCurrentUser();
            setUserDetail(currentUser)

            setFetching(true)
            const url = `${settings.apiRoot}/api/v1/player/${currentUser.id}/${agent.id}`;
            const response = await adapter.Get(url);
            if (response.ok) {
                const jsonResponse = await response.json();            
                setPlayers(jsonResponse.data.players)
                setPlayers2(jsonResponse.data.players)
            }
            setFetching(false)
        }

        fetchData();
    }, []);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value)
        const filter = players2.filter(player => e.target.value !== "" ?
            player.userName.toLowerCase().includes(e.target.value.toLowerCase())
            : player)
        setPlayers(filter)
    }

    const formatNumber = (num) => {
        if ((num == undefined  || num == '' || isNaN(num))) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <Paper className={classes.root}>
            <Navbar userType={userDetail.role} title={"Players List"} />
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <p>Agent: <span style={{fontWeight:'bold'}}>{currentAgent.userName}</span></p>
                        <TextField onChange={handleChangeSearch} value={search} fullWidth id="outlined-basic" label="Search Player" variant="outlined" size="small" />
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: "5px"}}>
                        {fetching ?
                            <LoadingTable />
                            :
                            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                            
                            <Table stickyHeader className="table-style" className={classes.container}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                        <TableCell align="right" className={classes.tableHead}>Points</TableCell>
                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        players.length > 0 ?
                                            players.map((player, index) => (
                                                <TableRow >
                                                    <TableCell align="left" className={classes.tableCell}>{player.userName}</TableCell>
                                                    <TableCell align="right" className={classes.tableCell}>{formatNumber(player.points)}</TableCell>
                                                </TableRow>
                                            ))
                                            :
                                            <TableRow hover>
                                                <TableCell>No players yet.</TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>       
                            </TableContainer>                     
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button onClick={()=> history.push('/operator/operator-agent-players')}
                        variant="contained"
                        color="primary" fullWidth size='small'>Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    )
}
