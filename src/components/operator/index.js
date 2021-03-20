import React, { useState, useEffect } from 'react';
import '../css/Operator.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Navbar from '../common/Navbar';
import { Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';

export default function OperatorAgents(){

    const [agents, setAgents] = useState([]);
    const [userType, setUserType] = useState('')
    const [search, setSearch] = useState('')

    useEffect( async ()=>{
        const url = `${settings.apiRoot}/api/v1/Operator/Agents/10010`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            console.log(jsonResponse.data.agents);
            setAgents(jsonResponse.data.agents)
        }
        const userType = await authenticationService.getCurrentUser()
        setUserType(userType.role)

    },[])

    const handleChangeSearch = (e) =>{
        setSearch(e.target.value)
        const result = agents.filter((item)=>{
            return item.email == e.target.value && item.userName === e.target.value
        })
        console.log(result);
      
    }

    return(
        <div>
            <Navbar userType={userType} title={"Agents List"}/>
            <Container maxWidth="md">
                <Grid container className="container-style">
                    <Grid item xs={12} md={6}>
                        <TextField onChange={handleChangeSearch} value={search} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Table stickyHeader className="table-style">
                            <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Phone Number</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {agents.map((agent,index)=>(
                                <TableRow hover key={index}>
                                    <TableCell align="left">{agent.userName}</TableCell>
                                    <TableCell align="left">{agent.email}</TableCell>
                                    <TableCell align="left">{agent.phoneNumber}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="outlined">Generate Registration Link</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
