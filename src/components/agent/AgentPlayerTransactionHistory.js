import { Button, Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { authenticationService } from "../../services/authenticationService";
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
        minHeight: 440,        
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

export default function AgentPlayerTransactionHistory() {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [transactionHistory, setTransactionHistory] = useState({});
    const [fetchingTransactionHistory, setFetchingTransactionHistory] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(false);

    useEffect(() => {
        fetchTransactionHistory();
    }, [])

    async function fetchTransactionHistory() {
        setFetchingTransactionHistory(true);
        const player = JSON.parse(sessionStorage.getItem('player'));
        setCurrentPlayer(player);
        const url = `${settings.apiRoot}/api/v1/transaction/history/${player.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();            
            setTransactionHistory(jsonResponse.data.transactions);
        }

        setFetchingTransactionHistory(false);
    }

    const formatNumber = (num) => {
        if (num == undefined || num == undefined) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={currentUser.role} title="Transaction History" />
            <Container maxWidth="sm"  style={{marginTop: '-20px'}}>
                <Grid container className="container-style">
                    <Grid item xs={12} md={12} className="agent-details-container">
                        <p> Player:  <span style={{fontWeight: 'bold'}}>{currentPlayer.userName}</span></p>
                    </Grid>
                    <Grid item xs={12} md={12} >
                        {fetchingTransactionHistory ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableHead}>Date</TableCell>
                                            <TableCell align="left" className={classes.tableHead}>Transaction</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Amount</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Balance</TableCell>
                                            <TableCell align="center" className={classes.tableHead}>Note</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            transactionHistory.length > 0 ?
                                                transactionHistory.map((transaction, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index}>
                                                        <TableCell align="left" className={classes.tableCell}>{ new Date(transaction.createDateTime).toLocaleDateString()}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{transaction.transactionType}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(transaction.amount)}</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(transaction.balance)}</TableCell>
                                                        <TableCell align="left" className={classes.tableCell}>{transaction.tag}</TableCell>
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
                        <Button variant="outlined" onClick={() => history.push('/agent/player-points/' + currentPlayer.id) } fullWidth variant="contained"
                                color="primary">Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}