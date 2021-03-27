import { Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useEffect, useState } from "react"
import { authenticationService } from "../../services/authenticationService";
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
})

export default function PlayerContest() {
    const classes = useStyles();
    const currentUser = authenticationService.getCurrentUser();
    const [playerTeamsInContest, setPlayerTeamsInContest] = useState({});
    const [fetchingPlayerTeamsInContest, setFetchingPlayerTeamsInContest] = useState(false);
    const [teamRanks, setTeamRanks] = useState({});
    const [fetchingTeamRanks, setFetchingTeamRanks] = useState({});

    useEffect(() => {
        fetchPlayerTeamsInContest();
        fetchTeamRanks();
    }, []);

    async function fetchPlayerTeamsInContest() {
        setFetchingPlayerTeamsInContest(true);
        const contestId = 1; //todo : replace with true contest id
        const url = `${settings.apiRoot}/api/v1/player/teamsincontest/${currentUser.id}/${contestId}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();            
            setPlayerTeamsInContest(jsonResponse.data.playerTeams);
        }

        setFetchingPlayerTeamsInContest(false);
    }

    async function fetchTeamRanks(){
        setFetchingTeamRanks(true);
        const url = `${settings.apiRoot}/api/v1/contest/teamranks/${currentUser.operatorId}`;
        const response = await adapter.Get(url);
        
        if (response.ok){
            const jsonResponse = await response.json();            
            setTeamRanks(jsonResponse.data.teamRankPrizes);
        }
        setFetchingTeamRanks(false);
    }

    const handleTeamClick = () => {

    }

    const handleTeamRankTeamClick =() =>{

    }

    return (
        <div className={classes.root} >
            <Navbar userType={currentUser.role} title="Contests" />
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <Typography color="primary" varian="subtitle1">
                            Your Teams
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetchingPlayerTeamsInContest ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableCell}>Rank</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Team</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            playerTeamsInContest.length > 0 ?
                                                playerTeamsInContest.map((team, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamClick(team)}>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamRank}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamName}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.score}</TableCell>
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
                        <Typography color="primary" varian="subtitle1" style={{ marginTop: '30px' }}>
                            Team Ranks
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetchingTeamRanks ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableCell}>Rank</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Team</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            teamRanks.length > 0 ?
                                                teamRanks.map((team, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamRankTeamClick(team)}>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamRank}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.teamName}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{team.score}</TableCell>
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
                </Grid>
            </Container>
        </div>

    )
}