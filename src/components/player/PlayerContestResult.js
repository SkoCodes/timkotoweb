import { Button, Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { authenticationService } from "../../services/authenticationService"
import settings from "../../settings";
import adapter from "../../utils/adapter";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";
import { useHistory } from "react-router";

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
export default function PlayerContestResult() {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [contestResult, setContestResult] = useState({});
    const [fetchingContestResult, setFetchingContestResult] = useState(false);
    useEffect(() => {        
        setContestResult({});
        FetchContentResult();
    }, [currentDate]);

    async function FetchContentResult() {
        if (currentDate !== "") {
            setFetchingContestResult(true);
            const url = `${settings.apiRoot}/api/v1/contest/teamhistoryranks/${currentUser.operatorId}/${currentDate}`;
            const response = await adapter.Get(url);            

            if (response.ok) {
                const jsonResponse = await response.json();
                setContestResult(jsonResponse.data.teamRankPrizes);
            }
            setFetchingContestResult(false);
        }
    }

    const formatNumber = (num) => {
        if (num == undefined || num == undefined) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={currentUser.role} title="Contest Result" />
            <Container maxWidth="xs" >
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <form>
                            <span style={{fontWeight: 'bold'}}>Date of Contest :</span>
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
                        {fetchingContestResult ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{marginTop: '20px'}}>
                                <Table stickyHeader className="table-style" className={classes.container}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                            <TableCell align="center" className={classes.tableHead}>Rank - Score</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Prize</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            contestResult.length > 0 ?
                                                contestResult.map((result, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index}>
                                                        <TableCell align="left" className={classes.tableCell}>{result.teamName}</TableCell>
                                                        <TableCell align="center" className={classes.tableCell}>{result.teamRank} - {result.score}</TableCell>                                                        
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(result.prize)}</TableCell>
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
                        <Button variant="contained" onClick={() => history.push('/player')} fullWidth color='primary'  size='small'>Home</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}