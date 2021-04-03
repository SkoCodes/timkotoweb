import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });
  
    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }

export default function Navbar(props){
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = () => {
        handleClose()
    }

    const agentMenu = (uType) => {
        if(uType != 'Agent')
            return {display:'none'};
        else
            return {display:'block'};
    }

    const playerMenu = (uType) => {
        if(uType != 'Player')
            return {display:'none'};
        else
            return {display:'block'};
    }

    const operatorMenu = (uType) => {
        if(uType != 'Operator')
            return {display:'none'};
        else
            return {display:'block'};
    }

    const handleLogout = () =>{
        authenticationService.logoutUser()
        history.push('/')
    }

    const userType = props.userType

    return(
        <div>
            <ElevationScroll {...props}>
                <AppBar color="default">
                <Toolbar>
                        <IconButton onClick={handleClick} edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => history.push('/operator')} style ={operatorMenu(userType)} >Home</MenuItem>
                            <MenuItem onClick={() => history.push('/operator/contests')} style ={operatorMenu(userType)}>Contests</MenuItem>
                            <MenuItem onClick={() => history.push('/agent')} style ={agentMenu(userType)} >Home</MenuItem>
                            <MenuItem onClick={() => history.push('/agent/contest/players')} style ={agentMenu(userType)} >Contest Players</MenuItem>
                            <MenuItem onClick={() => history.push('/player')} style ={playerMenu(userType)} >Home</MenuItem>
                            <MenuItem onClick={() => history.push('/player/contest')} style ={playerMenu(userType)} >Live Scores</MenuItem>
                            <MenuItem onClick={() => history.push('/player/team/history')} style ={playerMenu(userType)} >My Teams</MenuItem>
                            <MenuItem onClick={() => history.push('/player/contest/result')} style ={playerMenu(userType)} >Contest Results</MenuItem>
                            <MenuItem onClick={() => history.push('/player/transaction/history')} style ={playerMenu(userType)} >Transaction History</MenuItem>
                            <MenuItem onClick={() => history.push('/player/rules')} style ={playerMenu(userType)} >Rules</MenuItem>
                            <MenuItem onClick={handleLogout}><ExitToAppIcon style={{marginRight: '10px'}}/> Logout</MenuItem>
                        </Menu>
                        <Typography variant="h6" style={{textAlign: 'center', flexGrow: 1, fontWeight: 'bold'}}>{props.title}</Typography>
                </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
        </div>
    )
}