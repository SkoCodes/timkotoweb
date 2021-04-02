import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import { useHistory } from 'react-router-dom'
import { authenticationService } from '../../services/authenticationService';
import { TableContainer, Container, Grid, TextField, Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
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

export default function AgentPoints(){
    const classes = useStyles();
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
        const filter = points2.filter(point => date.toString() !=="" ? 
            point.gameDate.toString().includes(date.toString()) : point)
        setPoints(filter)
    }

    const formatNumber = (num) => {
        if ((num == undefined  || num == '' || isNaN(num))) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    
    return(
        <div>
            <Navbar userType={userType} title={"Agent Points"}/>
            <Container maxWidth="xs">
                <div className="agent-details-container">
                    <p><span style={{fontWeight: 'bold'}}>Name: </span> {agentDetails.userName}</p>
                    <p><span style={{fontWeight: 'bold'}}>Email: </span> {agentDetails.email}</p>
                    <p><span style={{fontWeight: 'bold'}}>Phone: </span> {agentDetails.phoneNumber}</p>
                </div>
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
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
                <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                    <Table stickyHeader  className="table-style" className={classes.container}>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" className={classes.tableHead}>Contest</TableCell>
                            <TableCell align="right" className={classes.tableHead}>Collection</TableCell>
                            <TableCell align="right" className={classes.tableHead}>Commision</TableCell>
                            <TableCell align="right" className={classes.tableHead}>Prize</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                points.length > 0 ?
                                points.map((point,index)=>(
                                <TableRow hover key={index}>
                                        <TableCell align="left" className={classes.tableCell}>{point.gameDate}</TableCell>
                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(point.collectible)}</TableCell>
                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(point.commission)}</TableCell>
                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(point.prize)}</TableCell>
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
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12} className="generate-button-container">
                    <Button variant="contained" onClick={()=> history.push('/operator')} color='primary' fullWidth size='small'>Back</Button>
                </Grid>
            </Container>
        </div>
    )
}