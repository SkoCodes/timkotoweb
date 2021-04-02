import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import { Container, Grid, Button, Paper } from '@material-ui/core';
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
    const [maximum, setMaximum] = useState(0);
    const [openDialog, setOpenDialog] = useState(false)
    const [position, setPostion] = useState('')
    const [teamName, setTeamName] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [openSuccesDialog, setOpenSuccesDialog] = useState(false);
    const [openSalaryExceededDialog, setOpenSalaryExceededDialog] = useState(false);
    const [openPlayerCountDialog, setOpenPlayerCountDialog] = useState(false);
    const [openForbiddenDialog, setOpenForbiddenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false)
    const [forbiddenMessage, setForbiddenMessage] = useState('')
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const formatNumber = (num) => {
        if (num == undefined || num == undefined) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

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

     const onSelectPlayer = (positionName, playerId, selectedPlayer, playerSalary) =>{
        setPostion(positionName)
        if(selectedPlayer){
            setSalaryCap(salaryCap + playerSalary)
            players[players.findIndex(player => player.position === positionName)].players.filter(_ => _.playerId).selected =false;
            const playerPosition = players.findIndex(player => player.position === positionName)
            const newPlayer = players[playerPosition].players
            const playerIdPosition = newPlayer.findIndex(player => player.playerId === playerId)
            let newArray = [...players]
            newArray[playerPosition].players[playerIdPosition] = {...newArray[playerPosition].players[playerIdPosition], selected: !newArray[playerPosition].players[playerIdPosition].selected}
            setPlayers(newArray)
        }
        else{
            //get selected players count in position
            var selectedCount  = players[players.findIndex(player => player.position === positionName)].players.filter(_ => _.selected).length
            if(selectedCount + 1 > maximum){
                setOpenDialog(true)
            }
            else{
            setSalaryCap(salaryCap - playerSalary)
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
        //var teamName = user.userName

        //get total selected players
        var selectedCount = 0; 
        players.map(function(item){
            selectedCount += item.players.filter(_ => _.selected).length;
        });

        if (salaryCap < 0){
            setSubmitting(false)
            window.scroll(0,0)
            setError(true)
            setOpenSalaryExceededDialog(true)
        }
        else if (selectedCount != 9){
            setSubmitting(false)
            window.scroll(0,0)
            setError(true)
            setOpenPlayerCountDialog(true)
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
                    teamName: user.userName
                },
                lineUp: players
            }
            const url = `${settings.apiRoot}/api/v1/Contest/Lineup`;
            const response = await adapter.Post(url,content)
            if(response.ok){
                const jsonResponse = await response.json()
                setOpenSuccesDialog(true)
            }
            else if (response.status == 403){
                const jsonResponse = await response.json()
                setForbiddenMessage(jsonResponse.result.description)
                setOpenForbiddenDialog(true)
            }
            setSubmitting(false)
        }
    }

    return(
        <div>
            <BackdropLoading open={loading}/>
            <Navbar userType={"Player"} title={"Create Team"}/>
            <Container maxWidth="md">
                <Grid container style={{marginTop: '2px'}}>
                    <Grid item xs={12} md={12}>
                        <Grid container justify="left">
                            <Grid item xs={12} md={8} style={{fontWeight: 'bold', padding: '2px'}}>
                            <p>Salary Cap: <span style={{ color: salaryCap < 0 ? 'red' : 'green'}} >{" " + formatNumber(salaryCap)}</span></p>
                                 
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '1px'}}>
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
                                    <PlayerTable position={player.position} data={player} maximum={maximum} updateMaximum={setMaximum} salarycap={salaryCap} updateSalarycap={setSalaryCap} onSelectPlayer={onSelectPlayer}/>
                                </TabPanel>
                               ))
                           }
                    </Grid>
                    <Grid item xs={12} md={12} style={{marginTop: '2px'}}>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={6}>
                                <Button 
                                variant="contained"
                                size='small'
                                color="primary" fullWidth onClick={()=>history.push('/player')}>Back</Button>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Button onClick={handleCreate} disabled={submitting} fullWidth 
                                variant="contained"
                                color="primary"
                                size='small'
                                startIcon={submitting && <FaSpinner className="spinner" />}>Join Contest</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={openDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    You can only select up to {maximum} players in {position} position.
                    <Button variant="contained" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenDialog(false)} size='small' color='primary'>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openSuccesDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    Team {teamName} created and joined contest.
                    <Button disabled={submitting} startIcon={submitting && <FaSpinner className="spinner" />} variant="contained" style={{margin: '20px 0px'}} fullWidth onClick={()=>history.push('/player')} size='small' color='primary'>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openSalaryExceededDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    Total players' salary exceeded salary cap.
                    <Button variant="contained" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenSalaryExceededDialog(false)} size='small' color='primary'>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openPlayerCountDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    Please select exactly 9 players.
                    <Button variant="contained" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenPlayerCountDialog(false)} size='small' color='primary'>OK</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openForbiddenDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    {forbiddenMessage}
                    <Button variant="contained" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenForbiddenDialog(false)} size='small' color='primary'>OK</Button>
                </DialogContent>
            </Dialog>
            
        </div>
    )
}