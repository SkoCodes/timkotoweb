import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import { authenticationService } from '../../services/authenticationService';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, TextField, Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core';


export default function Contest(){
    const [userType, setUserType] = useState('');
    const [contests, setContests] = useState([]);
    const [contests2, setContests2] = useState([]);
    const [noData, setNoData] = useState(false)
    const [search, setSearch] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState({})

    useEffect(()=>{
        setLoading(true)
        async function fetchData(){
            const userType = await authenticationService.getCurrentUser()
            setUserType(userType.role)
            const date = new Date().toISOString().slice(0, 10)
            const url = `${settings.apiRoot}/api/v1/Operator/Agents/${userType.id}/${date.toString()}`;
            const response = await adapter.Get(url);
            if (response.ok)
            {   
                const jsonResponse = await response.json();
                setContests(jsonResponse.data.agents)
                setContests2(jsonResponse.data.agents)
                setSummary(jsonResponse.data.summary)
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
        const summary1 = summary
        console.log(summary1)
        const date = e.target.value
        const userType = await authenticationService.getCurrentUser()
        const url = `${settings.apiRoot}/api/v1/Operator/Agents/${userType.id}/${date.toString()}`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setContests(jsonResponse.data.agents)
            setContests2(jsonResponse.data.agents)
            setSummary(jsonResponse.data.summary)
            setNoData(false)
        }
        else{
            setNoData(true)
        }
    }

    const handleSearch = (e) =>{
        setSearch(e.target.value)
        const filter = contests2.filter(contest => e.target.value !=="" ? 
        contest.userName.toLowerCase().includes(e.target.value.toLowerCase()) : contest)
        setContests(filter)
    }

    return(
        <div>
            <Navbar userType={userType} title={"Contests Points"}/>
            <Container maxWidth="md">
                <Grid container style={{marginTop: '20px'}}>
                    <Grid item xs={12} md={12} className="summary-container" style={{marginBottom: '30px'}}>
                        <p>Summary</p>
                        <p>Points Collected: {!noData ? summary.totalCollectible : 'No data'}</p>
                        <p>Commission Points: {!noData ? summary.totalAgentCommission: 'No data'}</p>
                        <p>Prize: {!noData ? summary.totalPrize : 'No data'}</p>
                    </Grid>
                    <Grid item xs={6} md={6}>
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
                    <Grid item xs={6} md={6}>
                        <TextField value={search} onChange={handleSearch} fullWidth id="outlined-basic" label="Search Agent" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Table stickyHeader  className="table-style">
                            <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Collection</TableCell>
                                <TableCell align="left">Commision</TableCell>
                                <TableCell align="left">Prize</TableCell>
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
                                        contests.map((agent,index)=>(
                                        <TableRow hover key={index}>
                                                <TableCell>{agent.userName}</TableCell>
                                                <TableCell>{agent.collectible}</TableCell>
                                                <TableCell>{agent.commission}</TableCell>
                                                <TableCell>{agent.prize}</TableCell>
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
                                    </>
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}