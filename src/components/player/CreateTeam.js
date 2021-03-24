import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import { Container, Grid, Button, TextField, Paper } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
            {children}
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(()=>{
        const contest = sessionStorage.getItem("contest")
        console.log(contest)
        fetchUser()
    },[])

    async function fetchUser (){
        const user = await authenticationService.getCurrentUser()
        // setUserDetail(user)
    }

    return(
        <div>
            <Navbar type={"Player"} title={"Create Team"}/>
            <Container maxWidth="md">
                <Grid container style={{marginTop: '30px'}}>
                    <Grid item xs={12} md={12} style={{padding: '20px'}}>
                        <Grid container justify="center">
                            <Grid item xs={3} md={2} style={{padding: '10px'}}>
                                Team Name:
                            </Grid>
                            <Grid item xs={9} md={6}>
                                <TextField fullWidth type="text" label="" variant="outlined" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper>
                            {/* <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                <Tab label="Item One" {...a11yProps(0)} />
                                <Tab label="Item Two" {...a11yProps(1)} />
                                <Tab label="Item Three" {...a11yProps(2)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                Item One
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                Item Two
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Item Three
                            </TabPanel> */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
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