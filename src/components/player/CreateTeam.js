import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import { Container, Grid, Button, TextField, Paper, Box, Typography } from '@material-ui/core';
import { authenticationService } from '../../services/authenticationService';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlayerTable from './PlayerTable';
import BackdropLoading from '../common/BackdropLoading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { FaSpinner } from 'react-icons/fa'
import { useHistory } from 'react-router';

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
    const history = useHistory()
    const [value, setValue] = useState(0);
    const [players, setPlayers] = useState([])
    const [salaryCap, setSalaryCap] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [maximum, setMaximum] = useState(0);
    const [openDialog, setOpenDialog] = useState(false)
    const [position, setPostion] = useState('')
    const [teamName, setTeamName] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [openSuccesDialog, setOpenSuccesDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (event, newValue) => {
      setValue(newValue);
      setSelected(0)
    };

    useEffect(()=>{
        setLoading(true)
        fetchPlayer()

    },[])

    async function fetchPlayer(){
        const contest = JSON.parse(sessionStorage.getItem("contest"))
        const id = contest.id
        const salarycap = contest.salaryCap
        setSalaryCap(salarycap);
        const user = await authenticationService.getCurrentUser()
        const url = `${settings.apiRoot}/api/v1/Contest/Players/${id}`;
        const response = await adapter.Get(url)
        if(response.ok){
            const jsonResponse = await response.json()
            setPlayers(jsonResponse.data)
            setLoading(false)
        }
    }

    const handleChangeTeamname = (e) =>{
        setError(false)
        setErrorMessage("")
        setTeamName(e.target.value)
    }


    const onSelectPlayer = (positionName, playerId, selectedPlayer, playerSalary) =>{
        setPostion(positionName)
        if(selected === maximum){
            setOpenDialog(true)
        }
        else{
            if(selectedPlayer){
                setSalaryCap(salaryCap + playerSalary)
                setSelected(selected - 1)
                const playerPosition = players.findIndex(player => player.position === positionName)
                const newPlayer = players[playerPosition].players
                const playerIdPosition = newPlayer.findIndex(player => player.playerId === playerId)
                let newArray = [...players]
                newArray[playerPosition].players[playerIdPosition] = {...newArray[playerPosition].players[playerIdPosition], selected: !newArray[playerPosition].players[playerIdPosition].selected}
                setPlayers(newArray)
            }
            else{
                setSalaryCap(salaryCap - playerSalary)
                setSelected(selected + 1)
                const playerPosition = players.findIndex(player => player.position === positionName)
                const newPlayer = players[playerPosition].players
                const playerIdPosition = newPlayer.findIndex(player => player.playerId === playerId)
                let newArray = [...players]
                newArray[playerPosition].players[playerIdPosition] = {...newArray[playerPosition].players[playerIdPosition], selected: !newArray[playerPosition].players[playerIdPosition].selected}
                setPlayers(newArray)
            }
        }
    }

    const handleCreate = async () =>{
        setSubmitting(true)
        const contest = JSON.parse(sessionStorage.getItem("contest"))
        const id = contest.id
        const user = await authenticationService.getCurrentUser()
        if(teamName === ""){
            window.scroll(0,0)
            setError(true)
            setErrorMessage("Required")
        }
        else{
            setError(false)
            setErrorMessage("")
            const content = {
                lineUpTeam:{
                    playerTeamId: 0,
                    operatorId: user.operatorId,
                    agentId: user.agentId,
                    userId: user.id,
                    contestId: id,
                    teamName: teamName
                },
                lineUp: players
            }
            const url = `${settings.apiRoot}/api/v1/Contest/Lineup`;
            const response = await adapter.Post(url,content)
            if(response.ok){
                const jsonResponse = await response.json()
                setSubmitting(false)
                setOpenSuccesDialog(true)
                console.log(jsonResponse)
            }
        }
    }

    return(
        <div>
            <BackdropLoading open={loading}/>
            <Navbar userType={"Player"} title={"Create Team"}/>
            <Container maxWidth="md">
                <Grid container style={{marginTop: '30px'}}>
                    <Grid item xs={12} md={12}>
                        <Grid container justify="center">
                            <Grid item xs={3} md={2} style={{padding: '10px'}}>
                                Team Name:
                            </Grid>
                            <Grid item xs={9} md={6}>
                                <TextField error={error} helperText={errorMessage} onChange={handleChangeTeamname} value={teamName} fullWidth type="text" label="" variant="outlined" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container justify="center">
                            <Grid item xs={12} md={8} style={{padding: '10px'}}>
                                Salary Cap: {" "+salaryCap}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '20px'}}>
                           <Paper>
                                <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
                                    {
                                        players.map((player,index)=>(
                                                <Tab key={index} label={player.position} {...a11yProps(index)} />
                                        ))
                                    }
                                </Tabs>
                           </Paper>
                           {
                               players.map((player,index)=>(
                                <TabPanel value={value} index={index} key={index}>
                                    <PlayerTable position={player.position} data={player} maximum={maximum} updateSelected={setSelected} updateMaximum={setMaximum} salarycap={salaryCap} updateSalarycap={setSalaryCap} onSelectPlayer={onSelectPlayer}/>
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
                                <Button onClick={handleCreate} variant="outlined" fullWidth>Create and Join Contest</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={openDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    You can only select up to {maximum} players in {position} position.
                    <Button variant="outlined" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenDialog(false)}>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openSuccesDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    Team created and joined contest
                    <Button disabled={submitting} startIcon={submitting && <FaSpinner className="spinner" />} variant="outlined" style={{margin: '20px 0px'}} fullWidth onClick={()=>history.push('/player')}>OK</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}