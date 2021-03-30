import { Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
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
        maxHeight: 440        
    },
    tableRow: {
        height: 30
    },
    tableCell: {
        padding: "1px 16px"
    }
});

export default function PlayerTransactionHistory() {
    const classes = useStyles();
    const currentUser = authenticationService.getCurrentUser();
    const [transactionHistory, setTransactionHistory] = useState({});
    const [fetchingTransactionHistory, setFetchingTransactionHistory] = useState(false);

    useEffect(() => {
        fetchTransactionHistory();
    }, [])

    async function fetchTransactionHistory() {
        setFetchingTransactionHistory(true);
        const url = `${settings.apiRoot}/api/v1/transaction/history/${currentUser.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();            
            setTransactionHistory(jsonResponse.data.transactions);
        }

        setFetchingTransactionHistory(false);
    }

    const formatNumber = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={currentUser.role} title="Transaction History" />
            <Container maxWidth="md">
                <Grid container className="container-style">
                    <Grid item xs={12} md={12} >
                        {fetchingTransactionHistory ? <LoadingTable /> :
                            <TableContainer className={classes.container}>
                                <Table stickyHeader className="table-style">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" className={classes.tableCell}>Date</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>Transaction</TableCell>
                                            <TableCell align="right" className={classes.tableCell}>Amount</TableCell>
                                            <TableCell align="right" className={classes.tableCell}>Balance</TableCell>
                                            <TableCell align="center" className={classes.tableCell}>Note</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            transactionHistory.length > 0 ?
                                                transactionHistory.map((transaction, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index}>
                                                        <TableCell align="center" className={classes.tableCell}>{ new Date(transaction.createDateTime).toLocaleDateString()}</TableCell>
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
                </Grid>
            </Container>
        </div>
    )
}