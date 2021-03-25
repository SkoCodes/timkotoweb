import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import '../css/Player.css';
import { Container, Grid, Button } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Divider from '@material-ui/core/Divider';
import { authenticationService } from '../../services/authenticationService';
import { useHistory } from 'react-router-dom';

export default function PlayerHomePage(){
    const history = useHistory()
    const [prizepool, setPrizepool] = useState([]);
    const [games, setGames] = useState([]);
    const [contest, setContest] = useState({});
    const [userType, setUserType] = useState('');
    const [balance, setBalance] = useState('');

    useEffect(()=>{
        fetchHomePageData()
    },[])

    async function fetchHomePageData(){
        const user = await authenticationService.getCurrentUser()
        const url = `${settings.apiRoot}/api/v1/Player/GetHomePageData/${user.operatorId}/${user.id}`;
        const response = await adapter.Get(url)
        if (response.ok)
        {
            const jsonResponse = await response.json()
            setPrizepool(jsonResponse.data.prizePool)
            setGames(jsonResponse.data.teams)
            setContest(jsonResponse.data.contest)
            setBalance(jsonResponse.data.balance)
            console.log(jsonResponse.data.contest)
            const contest = JSON.stringify(jsonResponse.data.contest)
            sessionStorage.setItem("contest", contest)
            console.log(jsonResponse)
        }
    }

    return(
        <div>
            <Navbar type={"Player"} title={"Points: " + balance} />
            <Container maxWidth="md">
                <Grid container justify="center" style={{marginTop: '30px'}}>
                    <Grid item xs={12} md={5}>
                        <List className="player-contest-list" style={{maxHeight: 300}} component="nav" aria-label="main mailbox folders">
                                {
                                    prizepool.length > 0 ?
                                    prizepool.map((prize, index) => (
                                        <ListItem button key={index}>
                                            <ListItemText primary={"Top: "+ prize.displayRank} />
                                            <ListItemText primary={prize.prize} align="right"/>
                                        </ListItem>
                                    ))
                                    :
                                    <ListItem button>
                                            <ListItemText primary="No data"/>
                                    </ListItem>
                                }
                        </List>
                    </Grid>
                    <Grid item xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <Grid container justify="center">
                            <Grid item xs={12} md={5}>
                                <Button onClick={()=> history.push('/player/create-team')} fullWidth variant="outlined" style={{marginTop: '30px'}}>Join Contest</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{textAlign: 'center', padding: '20px', fontWeight: 'bold'}}>
                                Upcoming NBA Games on {contest.gameDate}
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <List> 
                            <Divider />
                            {
                                games.map((game, index)=>(
                                    <>
                                    <ListItem key={index}>
                                        <Grid container style={{padding: '0 10px'}}>
                                            <Grid item xs={5} md={5} style={{textAlign: 'left', display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    {game.homeTeamNickName}
                                                </div>
                                                <div>
                                                    <img src={game.homeTeamLogo} alt="" style={{height: 50, width: 'auto'}}/>
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} md={2} style={{textAlign: 'center', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>
                                                <p style={{margin: 'auto 0'}}>VS</p>
                                            </Grid>
                                            <Grid item xs={5} md={5} style={{textAlign: 'right',display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    <img src={game.visitorTeamLogo} alt="" style={{height: 50, width: 'auto'}}/>
                                                </div>
                                                <div>
                                                    {game.visitorTeamName}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                    </>
                                ))
                            }
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}