import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import { useHistory } from 'react-router-dom'
import { authenticationService } from '../../services/authenticationService';
import { Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';

export default function AgentPoints(){
    const history = useHistory()
    const [userType, setUserType] = useState('');
    const [agentDetails, setAgentDetails] = useState({})
    const [points, setPoints] = useState([]);
    const [search, setSearch] = useState('')

    useEffect( async ()=>{
        const agent = JSON.parse(sessionStorage.getItem('operator-agent-points'))
        const url = `${settings.apiRoot}/api/v1/Agent/AgentPoints/${agent.agentId}`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setPoints(jsonResponse.data)
        }
        const userType = await authenticationService.getCurrentUser()
        setUserType(userType.role)
        setAgentDetails(JSON.parse(sessionStorage.getItem('operator-agent-points')))

    },[])

    return(
        <div>
            <Navbar userType={userType} title={"Agent Points"}/>
            <Container maxWidth="md">
                <div className="agent-details-container">
                    <p>{agentDetails.userName}</p>
                    <p>{agentDetails.email}</p>
                </div>
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <TextField value={search} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Table stickyHeader className="table-style">
                        <TableHead>
                        <TableRow>
                            <TableCell>Contest</TableCell>
                            <TableCell align="left">Collection</TableCell>
                            <TableCell align="left">Commision</TableCell>
                            <TableCell align="left">Prize</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                                <TableRow hover>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12} md={12} className="generate-button-container">
                    <Button variant="outlined" onClick={()=> history.push('/operator')}>Back</Button>
                </Grid>
            </Container>
        </div>
    )
}