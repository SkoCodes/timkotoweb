import logo from '../../logo.png';
import { useEffect, useState } from "react";
import settings from "../../settings";
import adapter from "../../utils/adapter";
import {FaSpinner} from 'react-icons/fa'
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    }
});

export default function Activation() {
    const classes = useStyles();
    const history = useHistory();
    const [message, setMessage] = useState('')
    const [activating, setActivating] = useState(true)
    const [activationSucceeded, setActivationSucceeded] = useState(false)

    useEffect(() => {        
        Activate();
    },[]);

    async function Activate() {
        setActivating(true)
        const url = `${settings.apiRoot}/api/registration/v1/user/activate`;
        
        const params = new URLSearchParams(window.location.search)
        let code = params.get('code')

        const content = {
            activationCode: code
        }

        const response = await adapter.Post(url, content);
        setActivating(false)
        if (response.ok) {
            const jsonResponse = await response.json();
            setActivationSucceeded(true)
            setMessage(jsonResponse.result.description)
        }
        else{
            setMessage('Activation failed.. Please contact your agent. You can also send us a message at Timkoto facebook page or send us an email at admin@timkoto.com')
        }
    }
    
    return (
        <div className={classes.root}>
            <Container maxWidth="xs" >
                <Grid container className="container-style">
                    <Grid item xs={12} md={12} style={{textAlign:'center'}}>
                        <img src={logo} className="app-logo" alt="logo" />
                    </Grid>
                </Grid>
                <Grid container className="container-style">
                    <div className="center-content">
                        {activating ? <div>Activating... <FaSpinner className="spinner" /></div>
                        :
                            <div></div>
                        }
                        
                    </div>
                    <div className="center-content">
                        <p>{message}</p>
                    </div>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        {activationSucceeded ?
                        
                        <Button variant="contained" onClick={() => history.push('/')} fullWidth color='primary'>Login</Button>
                        
                        :
                        <p></p>
                        }
                    </Grid>    
                </Grid>
            </Container>
        </div>
    )
}