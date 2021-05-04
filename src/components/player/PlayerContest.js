import { Button, Container, Dialog, DialogContent, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,DialogTitle, IconButton } from "@material-ui/core";
import { useEffect, useState } from "react"
import { authenticationService } from "../../services/authenticationService";
import settings from "../../settings";
import adapter from "../../utils/adapter";
import useInterval from "../../utils/useInterval";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    containerTeams: {
        maxHeight: 120,
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
})

export default function PlayerContest() {
    const oneMinuteInterval = 60000;
    const classes = useStyles();
    const currentUser = authenticationService.getCurrentUser();
    const [playerTeamsInContest, setPlayerTeamsInContest] = useState({});
    const [fetchingPlayerTeamsInContest, setFetchingPlayerTeamsInContest] = useState(false);
    const [teamRanks, setTeamRanks] = useState({});
    const [fetchingTeamRanks, setFetchingTeamRanks] = useState(false);
    const contest = JSON.parse(sessionStorage.getItem("contest"));
    const [showTeamStats, setShowTeamStats] = useState(false);
    const [teamStats, setTeamStats] = useState({});
    const [loadingTeamStats, setLoadingTeamStats] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({});

    useInterval(() => {
        if (contest !== null) {
            fetchPlayerTeamsInContest();
            fetchTeamRanks();
        }
    }, oneMinuteInterval * 3);


    useEffect(() => {
        if (contest !== null) {
            fetchPlayerTeamsInContest();
            fetchTeamRanks();
        }
    }, []);

    async function fetchPlayerTeamsInContest() {
        setFetchingPlayerTeamsInContest(true);
        const url = `${settings.apiRoot}/api/v1/player/teamsincontest/${currentUser.id}/${contest.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();
            setPlayerTeamsInContest(jsonResponse.data.playerTeams);
        }

        setFetchingPlayerTeamsInContest(false);
    }

    async function fetchTeamRanks() {
        setFetchingTeamRanks(true);
        const url = `${settings.apiRoot}/api/v1/contest/teamranks/${currentUser.operatorId}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();
            setTeamRanks(jsonResponse.data.teamRankPrizes);
        }
        setFetchingTeamRanks(false);
    }

    const handleTeamClick = (team) => {
        const selectedTeam = {
            id: team.id,
            score: team.score,
            teamRank: team.teamRank,
            teamName: team.teamName
        };
        showStats(selectedTeam);
    }

    const handleTeamRankTeamClick = (team) => {
        const selectedTeam = {
            id: team.playerTeamId,
            score: team.score,
            teamRank: team.teamRank,
            teamName: team.teamName
        };
        showStats(selectedTeam);
    }

    const showStats = async (team) => {
        if (team.id === undefined) {
            return;
        }
        setSelectedTeam(team);
        setShowTeamStats(true);

        setLoadingTeamStats(true);
        const url = `${settings.apiRoot}/api/v1/player/teamplayerstats/${team.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();
            setTeamStats(jsonResponse.data.playerStats);
        }
        setLoadingTeamStats(false);
    }

    const formatNumber = (num) => {
        if (num == undefined || num == '' || isNaN(num)) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }


    return (
        <div className={classes.root} >
            <Navbar userType={currentUser.role} title="Live Scores" />
            <Container maxWidth="xs">
                <Grid >
                    <Grid item xs={12} md={12} className="agent-details-container" style={{ marginTop: '15px' }}>
                        <span style={{ fontWeight: 'bold' }}>Your Team(s)</span>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ marginTop: '-20px' }}>
                        {fetchingPlayerTeamsInContest ? <LoadingTable /> :
                            <TableContainer className={classes.containerTeams} style={{ marginTop: '0px' }}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" className={classes.tableHead}>Rank</TableCell>
                                            <TableCell align="left" className={classes.tableHead}>Team</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            playerTeamsInContest.length > 0 ?
                                                playerTeamsInContest.map((team, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamClick(team)}>
                                                        <TableCell align="center" className={classes.tableCell}>{team.teamRank}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamName}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(team.score)}</TableCell>
                                                    </TableRow>
                                                )) :
                                                <TableRow hover>
                                                    <TableCell colSpan="5" align="center"></TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Grid>

                    <Grid item xs={12} md={12} className="agent-details-container" style={{ marginTop: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>Team Ranks</span>
                    </Grid>
                    <Grid item xs={12} md={12} >
                        {fetchingTeamRanks ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{ marginTop: '10px' }}>
                                <Table stickyHeader className="table-style" className={classes.container}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" className={classes.tableHead}>Rank</TableCell>
                                            <TableCell align="left" className={classes.tableHead}>Team</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            teamRanks.length > 0 ?
                                                teamRanks.map((team, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamRankTeamClick(team)}>
                                                        <TableCell align="center" className={classes.tableCell}>{team.teamRank}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamName}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(team.score)}</TableCell>
                                                    </TableRow>
                                                )) :
                                                <TableRow hover>
                                                    <TableCell colSpan="5" align="center"></TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={showTeamStats} fullWidth>
                <DialogContent style={{ textAlign: 'center', fontSize: '25px' }}>
                    <Grid container className='container-style'>
                        <Grid item xs={12} md={12} className="summary-container" style={{ marginBottom: '10px' }}>
                            <p>Score : <span style={{ fontWeight: 'bold' }}>{selectedTeam.score}</span></p>
                            <p>Rank : <span style={{ fontWeight: 'bold' }}>{selectedTeam.teamRank}</span></p>
                        </Grid>
                        <Grid item xs={12} md={12} style={{ align: 'center' }} style={{ marginTop: '10px' }}>
                            <Typography variant="h6" style={{ textAlign: 'center', flexGrow: 1 }}>{selectedTeam.teamName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {loadingTeamStats ? <LoadingTable /> :
                                <TableContainer className={classes.container} style={{ marginTop: '10px' }}>
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
                                                        <TableRow style={{ cursor: 'default' }} key={index} >
                                                            <TableCell align="left" className={classes.tableCell}>{teamStats.playerName}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{teamStats.points}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.rebounds)}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.assists)}</TableCell>
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
                        <Grid item xs={12} md={12}>
                            <Button variant="contained" style={{ margin: '20px 0px' }} fullWidth onClick={() => setShowTeamStats(false)} size='small' color='primary'>Close</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>

    )
}