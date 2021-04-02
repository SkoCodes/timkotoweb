import { Paper, Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { authenticationService } from "../../services/authenticationService"
import settings from "../../settings";
import adapter from "../../utils/adapter";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    tableRow: {
        height: 30
    },
    tableCell: {
        padding: "1px 5px"
    },
    tableHead: {
        padding: "1px 5px",
        backgroundColor: "#5353c6",
        color: "white"
    }
});

export default function PlayerTeamStats() {
    const history = useHistory();
    const classes = useStyles();
    const currentUser = authenticationService.getCurrentUser();
    const teamHistory = JSON.parse(sessionStorage.getItem("teamHistory"));
    const [teamStats, setTeamStats] = useState({});
    const [fetchingTeamStats, setFetchingTeamStats] = useState(false);

    useEffect(() => {
        fetchTeamStats();
    }, []);

    async function fetchTeamStats() {
        setFetchingTeamStats(true);
        const url = `${settings.apiRoot}/api/v1/player/teamplayerstats/${teamHistory.id}`;
        const response = await adapter.Get(url);
        
        if (response.ok) {
            const jsonResponse = await response.json();
            setTeamStats(jsonResponse.data.playerStats);
        }
        setFetchingTeamStats(false);
    };

    const formatNumber = (num) => {
        if (num == undefined  || num == '' || isNaN(num))  return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        
        <div className={classes.container}>
            <Navbar userType={currentUser.role} title="Team Stats" />
            <Container maxWidth="xs">
                <Grid container  className="container-style">
                    <Grid item xs={12} md={12} className="summary-container" style={{marginBottom: '10px'}}>
                        <p>Score : <span style={{fontWeight: 'bold'}}>{teamHistory.score}</span></p>
                        <p>Rank : <span style={{fontWeight: 'bold'}}>{teamHistory.teamRank}</span></p>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ align: 'center' }} style={{ marginTop: '-20px' }}>
                        <Typography variant="h6" style={{ textAlign: 'center', flexGrow: 1 }}>{teamHistory.teamName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ marginTop: '-5px' }} >
                        {fetchingTeamStats ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                                <Table stickyHeader className="table-style" className={classes.container}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>P</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>R</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>A</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>S</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>B</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>T</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>TS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            teamStats.length > 0 ?
                                                teamStats.map((teamStats, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} >
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.playerName}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.points}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.rebounds}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.assists}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.steals}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.blocks}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{teamStats.turnOvers}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.totalPoints)}
                                                        </TableCell>
                                                    </TableRow>
                                                )) :
                                                <TableRow hover>
                                                    <TableCell colSpan="5" align="center">No Data</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Grid>
                    <Grid item xs={12} md={12} style={{ marginTop: '10px' }} >
                        <Button variant="outlined" onClick={() => history.push('/player/team/history')} fullWidth variant="contained"
                                color="primary" size='small' >Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
 
    )
}