import { Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
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
export default function PlayerContestResult() {
    const classes = useStyles();
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
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={currentUser.role} title="Contest Result" />
            <Container maxWidth="xs" >
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <form>
                            Date of Contest :
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
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableCell}>Name</TableCell>
                                            <TableCell align="center" className={classes.tableCell}>Rank - Score</TableCell>
                                            <TableCell align="right" className={classes.tableCell}>Prize</TableCell>
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
                </Grid>
            </Container>
        </div>
    )
}