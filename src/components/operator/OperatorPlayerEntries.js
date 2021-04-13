import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import { authenticationService } from '../../services/authenticationService';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TableContainer, Container, Grid, Paper, TextField, Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core';
import { useHistory } from 'react-router-dom'

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
        padding: "1px 6px",
    },
    tableHead: {
        padding: "1px 6px",
        backgroundColor: "#5353c6",
        color: "white"
    }
  });

export default function OperatorPlayerEntries(){
    const history = useHistory()
    const classes = useStyles();
    const [userType, setUserType] = useState('');
    const [contests, setContests] = useState([]);
    const [contests2, setContests2] = useState([]);
    const [noData, setNoData] = useState(false)
    const [search, setSearch] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [loading, setLoading] = useState(false)

    const formatNumber = (num) => {
        if ((num == undefined  || num == '' || isNaN(num))) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    useEffect(()=>{
        setLoading(true)
        async function fetchData(){
            const userType = await authenticationService.getCurrentUser()
            setUserType(userType.role)
            const date = new Date().toISOString().slice(0, 10)
            const url = `${settings.apiRoot}/api/v1/Operator/Players/${userType.id}/${date}`;
            const response = await adapter.Get(url);
            if (response.ok)
            {   
                const jsonResponse = await response.json();
                setContests(jsonResponse.data.players)
                setContests2(jsonResponse.data.players)
                setNoData(false)
                setLoading(false)
            }
            else{
                setNoData(true)
                setLoading(false)
            }
        }
        fetchData();
    },[])

    async function handleChangeDate(e){
        setDate(e.target.value)
        const date = e.target.value
        const userType = await authenticationService.getCurrentUser()
        const url = `${settings.apiRoot}/api/v1/Operator/Players/${userType.id}/${date}`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setContests(jsonResponse.data.players)
            setContests2(jsonResponse.data.players)
            setNoData(false)
        }
        else{
            setNoData(true)
        }
    }

    const handleSearch = (e) =>{
        setSearch(e.target.value)
        const filter = contests2.filter(contest => e.target.value !=="" ? 
        contest.agentName.toLowerCase().includes(e.target.value.toLowerCase()) : contest)
        setContests(filter)
    }

    return(
        <div>
            <Navbar userType={userType} title="Player Entries"/>
            <Container maxWidth="xs">
                <Grid container style={{marginTop: '20px'}}>
                    <Grid item xs={12} md={12}>
                        <TextField
                                id="date"
                                type="date"
                                label="Search contest"
                                defaultValue={date}
                                onChange={handleChangeDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '10px'}}>
                        <TextField value={search} onChange={handleSearch} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" size='small'/>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                        <Table stickyHeader  className="table-style" className={classes.container}>
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" className={classes.tableHead} >Agent</TableCell>
                                <TableCell align="left" className={classes.tableHead} >Player</TableCell>
                                <TableCell align="right" className={classes.tableHead} >Entries</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {noData ?
                                    <TableRow>
                                        <TableCell colSpan="5" align="center">
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                    :
                                    <>
                                    {   
                                        contests.length > 0 ?
                                        contests.map((player,index)=>(
                                        <TableRow >
                                                <TableCell align="left" className={classes.tableCell}>{player.agentName}</TableCell>
                                                <TableCell align="left" className={classes.tableCell}>{player.playerName}</TableCell>
                                                <TableCell align="right" className={classes.tableCell}>{player.entries}</TableCell>
                                        </TableRow>
                                        ))
                                        :
                                        <TableRow hover>
                                                <TableCell>No Data</TableCell>
                                                <TableCell>No Data</TableCell>
                                                <TableCell>No Data</TableCell>
                                        </TableRow>
                                    }
                                    </>
                                }
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} className="generate-button-container">
                    <Button variant="contained" onClick={()=> history.push('/operator')} color='primary' fullWidth size='small'>Back</Button>
                </Grid>
            </Container>
        </div>
    )
}