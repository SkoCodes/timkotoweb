import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import { Container, Grid, Button, TextField, Paper, Box, Typography } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlayerTable from './PlayerTable';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{padding: '10px'}}
      >
        {value === index && (
            <div>{children}</div>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function CreateTeam(){
    const [value, setValue] = useState(0);
    const [players, setPlayers] = useState([])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(()=>{
        fetchPlayer()

    },[])

    async function fetchPlayer(){
        const contest = JSON.parse(sessionStorage.getItem("contest"))
        const id = contest.id
        const user = await authenticationService.getCurrentUser()
        const url = `${settings.apiRoot}/api/v1/Contest/Players/${id}`;
        const response = await adapter.Get(url)
        if(response.ok){
            const jsonResponse = await response.json()
            setPlayers(jsonResponse.data)
            console.log(jsonResponse.data)
        }
    }

    return(
        <div>
            <Navbar type={"Player"} title={"Create Team"}/>
            <Container maxWidth="md">
                <Grid container style={{marginTop: '30px'}}>
                    <Grid item xs={12} md={12}>
                        <Grid container justify="center">
                            <Grid item xs={3} md={2} style={{padding: '10px'}}>
                                Team Name:
                            </Grid>
                            <Grid item xs={9} md={6}>
                                <TextField fullWidth type="text" label="" variant="outlined" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '20px'}}>
                           <Paper>
                                <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
                                    <Tab label="SF" {...a11yProps(0)} />
                                    <Tab label="SG" {...a11yProps(1)} />
                                    <Tab label="PF" {...a11yProps(2)} />
                                    <Tab label="PG" {...a11yProps(3)} />
                                    <Tab label="C" {...a11yProps(4)} />
                                </Tabs>
                           </Paper>
                           {
                               players.map((player,index)=>(
                                <TabPanel value={value} index={index} key={index}>
                                    <PlayerTable data={player.players}/>
                                </TabPanel>
                               ))
                           }
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '20px'}}>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={6}>
                                <Button variant="outlined" fullWidth>Back</Button>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Button variant="outlined" fullWidth>Create and Join Contest</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}