
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
        padding: "1px 6px"
    },
    tableHead: {
        padding: "1px 6px",
        backgroundColor: "#5353c6",
        color: "white"
    }
});

export default function PlayerTeamHistory() {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [playerTeamHistory, setPlayerTeamHistory] = useState({});
    const [fetchingPlayerTeamHistory, setFetchingPlayerTeamHistory] = useState(false);

    useEffect(() => {
        fetchPlayerTeamHistory();
    }, []);

    async function fetchPlayerTeamHistory() {
        setFetchingPlayerTeamHistory(true);
        const url = `${settings.apiRoot}/api/v1/player/teamhistory/${currentUser.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();
            setPlayerTeamHistory(jsonResponse.data.playerTeams);
        }

        setFetchingPlayerTeamHistory(false);
    }

    const handleTeamHistoryClick = (teamHistory) => {        
        sessionStorage.setItem("teamHistory", JSON.stringify(teamHistory));
        history.push('/player/team/stats')
    }

    const formatNumber = (num) => {
        if (num == undefined  || num == '' || isNaN(num)) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <Paper className={classes.root}>
            <Navbar userType={currentUser.role} title="My Teams" />
            <Container maxWidth="xs" style={{marginTop: '20px'}}>
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        {fetchingPlayerTeamHistory ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                                <Table stickyHeader className="table-style" className={classes.container}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableHead}>Contest</TableCell>
                                            <TableCell align="left" className={classes.tableHead}>Team Name</TableCell>
                                            <TableCell align="center" className={classes.tableHead}>Rank - Score</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Prize</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            playerTeamHistory.length > 0 ?
                                                playerTeamHistory.map((teamHistory, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamHistoryClick(teamHistory)}>
                                                        <TableCell align="left" className={classes.tableCell}>{teamHistory.gameDate}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamHistory.teamName}</TableCell>
                                                        <TableCell align="center" className={classes.tableCell}>{teamHistory.teamRank} - {formatNumber(teamHistory.score)}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(teamHistory.prize)}</TableCell>
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
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="contained" onClick={() => history.push('/player')} fullWidth color='primary' size='small'>Home</Button>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    )
}