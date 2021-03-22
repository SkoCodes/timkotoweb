import React, { useState, useEffect } from 'react';
import '../css/Operator.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Navbar from '../common/Navbar';
import LoadingTable from '../common/LoadingTable';
import { useHistory } from 'react-router-dom';
import { Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';

export default function OperatorAgents(){
    const history = useHistory();
    const [agents, setAgents] = useState([]);
    const [agents2, setAgents2] = useState([]);
    const [userDetail, setUserDetail] = useState('')
    const [search, setSearch] = useState('')
    const [fetching, setFetching] = useState(false)

    useEffect( async ()=>{
        setFetching(true)
        const url = `${settings.apiRoot}/api/v1/Operator/Agents/10010`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setAgents(jsonResponse.data.agents)
            setAgents2(jsonResponse.data.agents)
            setFetching(false)
        }
        const user = await authenticationService.getCurrentUser()
        setUserDetail(user)

    },[])

    const handleChangeSearch = (e) =>{
        setSearch(e.target.value)
        const filter = agents2.filter(agent => e.target.value !=="" ?
            agent.userName.toLowerCase().includes(e.target.value.toLowerCase()) || agent.email.toLowerCase().includes(e.target.value.toLowerCase())
            : agent )
        setAgents(filter)
    }

    const handleRedirect = (agent) =>{
        sessionStorage.setItem('operator-agent-points', JSON.stringify(agent));
        history.push('/operator/agent-points/'+agent.id)
    }


    return(
        <div>
            <Navbar userType={userDetail.role} title={"Agents List"}/>
            <Container maxWidth="md">
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <TextField onChange={handleChangeSearch} value={search} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetching ? 
                        <LoadingTable />
                        :
                        <Table stickyHeader className="table-style">
                            <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Phone Number</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    agents.length > 0 ?
                                    agents.map((agent,index)=>(
                                        <TableRow style={{cursor: 'pointer'}} hover key={index} onClick={()=>handleRedirect(agent)}>
                                            <TableCell align="left">{agent.userName}</TableCell>
                                            <TableCell align="left">{agent.email}</TableCell>
                                            <TableCell align="left">{agent.phoneNumber}</TableCell>
                                        </TableRow>
                                        ))
                                    :
                                    <TableRow hover>
                                            <TableCell>No Data</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="outlined" onClick={()=> history.push('/operator/registration-link')}>Generate Registration Link</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
