import { Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from "@material-ui/core";
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
        padding: "1px 16px"
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
        console.log(teamHistory);
        const url = `${settings.apiRoot}/api/v1/player/teamplayerstats/${teamHistory.id}`;
        const response = await adapter.Get(url);
        
        if (response.ok) {
            const jsonResponse = await response.json();
            setTeamStats(jsonResponse.data.playerStats);
        }
        setFetchingTeamStats(false);
    };

    return (
        <div className={classes.container}>
            <Navbar userType={currentUser.role} title="Team Stats" />
            <Container maxWidth="md">
                <Grid container>
                    <Grid item xs={12} md={12}>
                        Score : {teamHistory.score}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        Rank : {teamHistory.teamRank}
                    </Grid>
                    <Grid item xs={12} md={12} style={{ align: 'center' }}>
                        <Typography variant="h6" style={{ textAlign: 'center', flexGrow: 1 }}>{teamHistory.teamName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetchingTeamStats ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableCell}>Name</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>P</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>R</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>A</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>S</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>B</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>T</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>TS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            teamStats.length > 0 ?
                                                teamStats.map((teamStats, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} >
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.playerName}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.points}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.rebounds}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.assists}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.steals}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.blocks}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.turnOvers}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{teamStats.points  + teamStats.rebounds + teamStats.assists + teamStats.steals + teamStats.blocks + teamStats.turnOvers}
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
                    <Grid item xs={12} md={12} style={{ marginTop: '20px' }}>
                        <Button variant="outlined" onClick={() => history.push('/player/team/history')} fullWidth>Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}