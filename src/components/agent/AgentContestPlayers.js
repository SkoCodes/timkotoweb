import { TableContainer, Paper, Container, Grid, Table, TextField, TableHead, TableRow, TableCell, TableBody, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { authenticationService } from "../../services/authenticationService";
import settings from "../../settings";
import adapter from "../../utils/adapter";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";
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
        padding: "1px 2px"
    },
    tableHead: {
        padding: "1px 2px",
        backgroundColor: "#5353c6",
        color: "white"
    }
  });

export default function AgentContestPlayers() {
    const classes = useStyles();
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [currentContestPlayers, setCurrentContestPlayers] = useState({});
    const [currentContestPlayers2, setCurrentContestPlayers2] = useState({});
    const [summary, setSummary] = useState({});
    const [fetching, setFecthing] = useState(false);
    const [showWinners, setShowWinners] = useState(false);

    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();

    useEffect(() => {
        async function fetchData() {
            setSummary({});
            setCurrentContestPlayers({});
            setCurrentContestPlayers2({});
            setShowWinners(false);

            if (currentDate !== "") {
                setFecthing(true);
                const url = `${settings.apiRoot}/api/v1/agent/players/${currentUser.operatorId}/${currentUser.id}/${currentDate}`;
                const response = await adapter.Get(url);
                setFecthing(false);

                if (response.ok) {
                    const jsonResponse = await response.json();                    
                    setSummary(jsonResponse.data.summary)
                    setCurrentContestPlayers(jsonResponse.data.players);
                    setCurrentContestPlayers2(jsonResponse.data.players);                    
                }
            }
        }

        fetchData();
    }, [currentDate])

    const handleShowWinnersClick = (e) => {
        setShowWinners(e.target.checked);
        if (currentContestPlayers2.length > 0) {
            const filter = currentContestPlayers2.filter(player => e.target.checked ? player.prize > 0 : player);
            setCurrentContestPlayers(filter);
        }
    }

    const formatNumber = (num) => {
        if (num == undefined || isNaN(num)) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <Paper className={classes.root}>
            <Navbar userType={currentUser.role} title="Contest Players" />
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <form>
                            <span style={{fontWeight:'bold'}}>Your Players in Contest: </span>
                        <TextField
                                id="date"
                                type="date"
                                defaultValue={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <span style={{fontWeight:'bold'}}>Summary</span>
                    </Grid>
                    <Grid item xs={12} md={12} className="summary-container" style={{marginBottom: '10px'}}>
                        <p>Collections: <span style={{fontWeight:'bold'}}>{formatNumber(summary.totalAmount)}</span></p>
                        <p>Commission: <span style={{fontWeight:'bold'}}>{formatNumber(summary.totalAgentCommission)}</span></p>
                        <p>Remit: <span style={{fontWeight:'bold'}}>{formatNumber(summary.totalAmount - summary.totalAgentCommission)}</span></p>
                        <p>Prize: <span style={{fontWeight:'bold'}}>{formatNumber(summary.totalPrize)}</span></p>
                    </Grid>
                    <Grid item xs={12} md={12} className="summary-container" >
                        <FormControlLabel control={<Checkbox onClick={handleShowWinnersClick} checked={showWinners} />} label="Show Winners Only" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetching ?
                            <LoadingTable />
                            :
                            <TableContainer className={classes.container}>
                            <Table stickyHeader className="table-style">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                        <TableCell align="center" className={classes.tableHead}>Rank -  Score</TableCell>
                                        <TableCell align="right" className={classes.tableHead}>Prize</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        currentContestPlayers.length > 0 ?
                                            currentContestPlayers.map((player, index) => (
                                                <TableRow style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left" className={classes.tableCell}>{player.userName}</TableCell>
                                                    <TableCell align="center" className={classes.tableCell}>{player.teamRank} - {player.score}</TableCell>
                                                    <TableCell align="right" className={classes.tableCell}>{formatNumber(player.prize)}</TableCell>
                                                </TableRow>
                                            ))
                                            :
                                            <TableRow>
                                                <TableCell colSpan="5" align="center">No Data</TableCell>

                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                            </TableContainer>
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="contained" onClick={() => history.push('/agent')} color="primary">Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    );
}