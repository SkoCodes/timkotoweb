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

export default function OperatorPlayerTransactionView() {
    const classes = useStyles();
    const history = useHistory();
    const player = JSON.parse(sessionStorage.getItem('player'));
    const [transactionHistory, setTransactionHistory] = useState({});
    const [fetchingTransactionHistory, setFetchingTransactionHistory] = useState(false);

    useEffect(() => {
        fetchTransactionHistory();
    }, [])

    async function fetchTransactionHistory() {
        setFetchingTransactionHistory(true);
        const url = `${settings.apiRoot}/api/v1/transaction/history/${player.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();            
            setTransactionHistory(jsonResponse.data.transactions);
        }

        setFetchingTransactionHistory(false);
    }

    const formatNumber = (num) => {
        if (num == undefined  || num == '' || isNaN(num)) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={'Operator'} title="Transaction History" />
            <Container maxWidth="sm"  style={{marginTop: '-5px'}}>
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <p>UserName: <span style={{fontWeight:'bold'}}>{player.userName}</span></p>
                        <p style={{marginTop:'-15px'}}>Email: <span style={{fontWeight:'bold'}}>{player.email}</span></p>
                        <p style={{marginTop:'-15px'}}>Phone Number: <span style={{fontWeight:'bold'}}>{player.phoneNumber}</span></p>
                    </Grid>
                    <Grid item xs={12} md={12} >
                        {fetchingTransactionHistory ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                                <Table stickyHeader className="table-style" className={classes.container}>
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
                                                    <TableRow style={{ cursor: 'default' }} hover key={index}>
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
                        <Button variant="outlined" onClick={() => history.push('/operator/agent-players-view') } fullWidth variant="contained"
                                color="primary"  size='small'>Back</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}