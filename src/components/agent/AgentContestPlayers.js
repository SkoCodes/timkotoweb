import { Container, Grid, Table, TextField, TableHead, TableRow, TableCell, TableBody, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { authenticationService } from "../../services/authenticationService";
import settings from "../../settings";
import adapter from "../../utils/adapter";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";

export default function AgentContestPlayers() {
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

    const handleRedirect = (player) => {
        const playerData = {
            id: player.playerId,
            operatorId: player.operatorId,
            userName: player.teamName
        }
        sessionStorage.setItem('agent-player-points', JSON.stringify(playerData));
        history.push('/agent/player-points/' + playerData.id);
    }

    const handleShowWinnersClick = (e) => {
        setShowWinners(e.target.checked);
        if (currentContestPlayers2.length > 0) {
            const filter = currentContestPlayers2.filter(player => e.target.checked ? player.prize > 0 : player);
            setCurrentContestPlayers(filter);
        }
    }

    const formatNumber = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div>
            <Navbar userType={currentUser.role} title="Contest Players" />
            <Container maxWidth="md">
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <form>
                            Your Players in Contest :
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
                        Summary:
                    </Grid>
                    <Grid item xs={12} md={12}>
                        Collections: {!isNaN(summary.totalAmount) ? formatNumber(summary.totalAmount) : ""}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        Commissions: {!isNaN(summary.totalAgentCommission) ? formatNumber(summary.totalAgentCommission) : ""}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        Prize: {!isNaN(summary.totalPrize) ? formatNumber(summary.totalPrize) : ""}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <FormControlLabel control={<Checkbox onClick={handleShowWinnersClick} checked={showWinners} />} label="Show Winners Only" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetching ?
                            <LoadingTable />
                            :
                            <Table stickyHeader className="table-style">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Team</TableCell>
                                        <TableCell align="left">Rank</TableCell>
                                        <TableCell align="left">Score</TableCell>
                                        <TableCell align="left">Prize</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        currentContestPlayers.length > 0 ?
                                            currentContestPlayers.map((player, index) => (
                                                <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRedirect(player)}>
                                                    <TableCell align="left">{player.userName}</TableCell>
                                                    <TableCell align="left">{player.teamName}</TableCell>
                                                    <TableCell align="left">{player.teamRank}</TableCell>
                                                    <TableCell align="left">{player.score}</TableCell>
                                                    <TableCell align="left">{player.prize}</TableCell>
                                                </TableRow>
                                            ))
                                            :
                                            <TableRow hover>
                                                <TableCell colSpan="5" align="center">No Data</TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="outlined" onClick={() => history.push('/agent')}>Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}