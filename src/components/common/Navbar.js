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

    const handleRedirect = () =>{
        handleClose()
    }

    const checkUserType = (type) =>{
        if(type = "Operator"){
            return(
                <>
                    <MenuItem onClick={handleRedirect()}>Contest Points</MenuItem>
                    <MenuItem onClick={handleRedirect()}>Agent List</MenuItem>
                </>
            )
        }
    }

    const handleLogout = () =>{
        authenticationService.logoutUser()
        history.push('/')
    }

    const type = props.type

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
                            <MenuItem onClick={handleLogout}><ExitToAppIcon style={{marginRight: '10px'}}/> Logout</MenuItem>
                        </Menu>
                        <Typography variant="h6" style={{textAlign: 'center', flexGrow: 1}}>{props.title}</Typography>
                </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
        </div>
    )
}