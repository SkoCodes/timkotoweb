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

 
export default function AgentPlayers() {
    const classes = useStyles();
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

    const formatNumber = (num) => {
        if (num == undefined || num == undefined) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <Paper className={classes.root}>
            <Navbar userType={userDetail.role} title={"Players List"} />
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
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
                                                <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRedirect(player)} >
                                                    <TableCell align="left" className={classes.tableCell}>{player.userName}</TableCell>
                                                    <TableCell align="right" className={classes.tableCell}>{formatNumber(player.points)}</TableCell>
                                                </TableRow>
                                            ))
                                            :
                                            <TableRow hover>
                                                <TableCell>You have no players yet.</TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>       
                            </TableContainer>                     
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button onClick={()=> history.push('/common/registration-link')}
                        variant="contained"
                        color="primary" size='small'>Generate Registration Link</Button>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    )
}
