import React, { useState } from 'react'
import Navbar from '../common/Navbar';
import { Container, Grid, Button, TextareaAutosize, TextField  } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import EmailIcon from '@material-ui/icons/Email';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LinkIcon from '@material-ui/icons/Link';
import settings from '../../settings';
import adapter from '../../utils/adapter';
import { FaSpinner } from 'react-icons/fa'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function RegistrationLink(){
    const history = useHistory()
    const [link, setLink] = useState('')
    const [fetching, setFetching] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerateLink = async () =>{
        setFetching(true)
        const user = JSON.parse(sessionStorage.getItem("user"))
        const url = `${settings.apiRoot}/api/v1/RegistrationCode/${user.id}`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            setFetching(false)
            setLink(jsonResponse.data.code);
        }
    }


    return(
        <div>
            <Navbar title={"Registration Link"}/>
            <Container maxWidth="sm">
                <Grid container className="container-style">
                    <Grid item xs={12} sm={12}>
                        <Button onClick={handleGenerateLink} startIcon={fetching ? <FaSpinner className="spinner"/> : <LinkIcon />} variant="outlined">Generate Link</Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextareaAutosize value={link} disabled className="text-area-style" aria-label="minimum height" rowsMin={3} placeholder="No link available" />
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <TextField style={{marginTop: '20px'}} fullWidth id="outlined-basic" label="Email Address" variant="outlined" />
                    </Grid>
                    <Grid container justify="center" spacing={5} style={{marginTop: '20px'}}>
                        <Grid item xs={6} sm={6}>
                            <Button startIcon={<EmailIcon />} fullWidth variant="outlined">Email Link</Button>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                                <Button endIcon={<FileCopyIcon />} fullWidth variant="outlined">Copy Link</Button>
                            </CopyToClipboard>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} className="generate-button-container">
                        <Button style={{marginTop: '50px'}} onClick={()=> history.push('/operator')} variant="outlined">Back</Button>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={copied}
                onClose={()=> setCopied(false)}
                autoHideDuration={3000}
            >
                <Alert severity="success">Copied to clipboard!</Alert>
            </Snackbar>
        </div>
    )
}