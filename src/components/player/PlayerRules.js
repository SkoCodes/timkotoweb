import { Container, Grid, Button, makeStyles } from "@material-ui/core";
import Navbar from "../common/Navbar";
import { useHistory } from "react-router";

const useStyles = makeStyles({
    rline: {
        margin: 0,
        padding: 0,
    }
});

export default function PlayerTransactionHistory() {
    const classes = useStyles();
    const history = useHistory();
    
    return (
        <div>
            <Navbar userType={"Player"} title="Rules" />
            <Container maxWidth="md" style={{marginTop: '20px'}}>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>1.</span> You need enough points to play in a contest.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>2.</span> To join a contest, create your team. You can create multiple teams in one contest.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>3.</span> Your team lineup must be exactly 9 NBA players. The number of players to select for each position is shown below.</p>
                <ul>
                    <li className={classes.rline}>SG - 2</li>
                    <li className={classes.rline}>SF - 2</li>
                    <li className={classes.rline}>PG - 2</li>
                    <li className={classes.rline}>PF - 2</li>
                    <li className={classes.rline}>C - 1</li>
                </ul>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>4.</span> No team entry will be accepted once the games has started.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>5.</span> Team lineup is final and cannot be changed after joining a contest.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>6.</span> Your players will be scored based on the following categories:</p>
                <ul>
                    <li className={classes.rline}>Three Point Field Goals: 3 points</li>
                    <li className={classes.rline}>Two Point Field Goals: 2 points</li>
                    <li className={classes.rline}>Free Throws Made: 1 point</li>
                    <li className={classes.rline}>Rebounds: 1.2 points</li>
                    <li className={classes.rline}>Assists: 1.5 points</li>
                    <li className={classes.rline}>Blocked Shots: 2 points</li>
                    <li className={classes.rline}>Steals: 2 points</li>
                    <li className={classes.rline}>Turnovers: -1 points</li>
                </ul>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>7.</span> Every team will be scored by the total accumulated points of the players in the team.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>8.</span> Teams will be ranked from highest to lowest. When applying lineup ranks, we will be using the Standard Competition Ranking Strategy. Below is an example:</p>
                <ul>
                    <li className={classes.rline}>Rank 1 - Score 380.5</li>
                    <li className={classes.rline}>Rank 2 - Score 378.6</li>
                    <li className={classes.rline}>Rank 3 - Score 371.5</li>
                    <li className={classes.rline}>Rank 3 - Score 371.5</li>
                    <li className={classes.rline}>Rank 5 - Score 365.6</li>
                    <li className={classes.rline}>Rank 6 - Score 360.9</li>
                </ul>
                <p className={classes.rline}>In the example above, rank 3 has equal scores. A gap will be left in the ranking numbers for every equal scores. Prizes for Top 3 and Top 4 will be shared equally between the Rank 3 teams.</p>
                <p className={classes.rline}><span style={{fontWeight: 'bold'}}>9.</span> Final scores and ranks will be processed and winners will be declared after the last game of the day is finished.</p>
                <p style={{textAlign:'center'}}><span style={{fontWeight: 'bold', textAlign:'center'}}>Goodluck and Enjoy!!!</span></p>
                <Grid item xs={12} md={12} style={{ marginTop: '10px' }} >
                        <Button variant="outlined" onClick={() => history.push('/player')} fullWidth variant="contained"
                                color="primary" size='small' >Home</Button>
                    </Grid>
            </Container>
            
        </div>
    )
}