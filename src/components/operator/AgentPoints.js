import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import { useHistory } from 'react-router-dom'
import { authenticationService } from '../../services/authenticationService';
import { Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
//import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function AgentPoints(){
    const history = useHistory()
    const [userType, setUserType] = useState('');
    const [agentDetails, setAgentDetails] = useState({})
    const [points, setPoints] = useState([]);
    const [points2, setPoints2] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

    useEffect(()=>{
        async function fetchData(){
            const agent = JSON.parse(sessionStorage.getItem('operator-agent-points'))
            const url = `${settings.apiRoot}/api/v1/Agent/AgentPoints/${agent.id}`;
            const response = await adapter.Get(url);
            if (response.ok)
            {   
                const jsonResponse = await response.json();
                setPoints(jsonResponse.data.agentsPoints)
                setPoints2(jsonResponse.data.agentsPoints)
            }
            const userType = await authenticationService.getCurrentUser()
            setUserType(userType.role)
        }
        fetchData();
        setAgentDetails(JSON.parse(sessionStorage.getItem('operator-agent-points')))

    },[])

    const handleDateChange = (e) =>{
        setDate(e.target.value)
        const date = e.target.value
        console.log(date)
        const filter = points2.filter(point => date.toString() !=="" ? 
            point.gameDate.toString().includes(date.toString()) : point)
        setPoints(filter)
    }

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
                        <TextField
                                id="date"
                                type="date"
                                label="Search contest"
                                defaultValue={""}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Table stickyHeader  className="table-style">
                        <TableHead>
                        <TableRow>
                            <TableCell>Contest</TableCell>
                            <TableCell align="left">Collection</TableCell>
                            <TableCell align="left">Commision</TableCell>
                            <TableCell align="left">Prize</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                points.length > 0 ?
                                points.map((point,index)=>(
                                <TableRow hover key={index}>
                                        <TableCell>{point.gameDate}</TableCell>
                                        <TableCell>{point.collectible}</TableCell>
                                        <TableCell>{point.commission}</TableCell>
                                        <TableCell>{point.prize}</TableCell>
                                </TableRow>
                                ))
                                :
                                <TableRow hover>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                        <TableCell>No Data</TableCell>
                                </TableRow>
                            }
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