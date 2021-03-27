
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
            console.log(jsonResponse.data.playerTeams);
            setPlayerTeamHistory(jsonResponse.data.playerTeams);
        }

        setFetchingPlayerTeamHistory(false);
    }

    const handleTeamNameClick = () => {

    }

    return (
        <div className={classes.container}>
            <Navbar userType={currentUser.role} title="MyTeams" />
            <Container maxWidth="xs">
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Typography variant="subtitle2">
                            Click on Team Name to view team statistics
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetchingPlayerTeamHistory ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableCell}>Contest</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Team Name</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Rank</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            playerTeamHistory.length > 0 ?
                                                playerTeamHistory.map((history, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamNameClick(history)}>
                                                        <TableCell align="left" className={classes.tableCell}>{history.gameDate}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{history.teamName}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{history.teamRank}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{history.score}</TableCell>
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
                        <Button variant="outlined" onClick={() => history.push('/player')} fullWidth>Home</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}