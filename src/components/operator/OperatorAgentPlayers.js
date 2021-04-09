import React, { useState, useEffect } from 'react';
import '../css/Operator.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Navbar from '../common/Navbar';
import LoadingTable from '../common/LoadingTable';
import { useHistory } from 'react-router-dom';
import {  TableContainer, Paper, Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';
import { makeStyles } from '@material-ui/core/styles';

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

export default function OperatorAgentPlayers(){
    const classes = useStyles();
    const history = useHistory();
    const [agents, setAgents] = useState([]);
    const [agents2, setAgents2] = useState([]);
    const [userDetail, setUserDetail] = useState('')
    const [search, setSearch] = useState('')
    const [fetching, setFetching] = useState(false)
    const currentUser = authenticationService.getCurrentUser();

    useEffect( async ()=>{
        setFetching(true)
        const url = `${settings.apiRoot}/api/v1/Operator/Agents/${currentUser.id}`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setAgents(jsonResponse.data.agents)
            setAgents2(jsonResponse.data.agents)
        }
        const user = await authenticationService.getCurrentUser()
        setUserDetail(user)
        setFetching(false)
    },[])

    const handleChangeSearch = (e) =>{
        setSearch(e.target.value)
        const filter = agents2.filter(agent => e.target.value !=="" ? agent.userName.toLowerCase().includes(e.target.value.toLowerCase()) : agent )
        setAgents(filter)
    }

    const handleRedirect = (agent) =>{
        sessionStorage.setItem('operator-selected-agent', JSON.stringify(agent));
        history.push('/operator/agent-players-view/')
    }

    return(
        <div>
            <Navbar userType={userDetail.role} title={"Agent-Players List"}/>
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <TextField onChange={handleChangeSearch} value={search} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" size="small"/>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetching ? 
                        <LoadingTable />
                        :
                        <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                        <Table stickyHeader className="table-style" className={classes.container}>
                            <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHead}>Name</TableCell>
                                <TableCell className={classes.tableHead} align="right">Phone Number</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    agents.length > 0 ?
                                    agents.map((agent,index)=>(
                                        <TableRow style={{cursor: 'pointer'}} hover key={index} onClick={()=>handleRedirect(agent)}>
                                            <TableCell align="left" className={classes.tableCell} >{agent.userName}</TableCell>
                                            <TableCell align="right" className={classes.tableCell} >{agent.phoneNumber}</TableCell>
                                        </TableRow>
                                        ))
                                    :
                                    <TableRow hover>
                                            <TableCell>No players yet.</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                        </TableContainer>       
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button onClick={()=> history.push('/operator')}
                        variant="contained"
                        color="primary" fullWidth size='small'>Home</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
