import React, { useState } from 'react'
import Navbar from './Navbar';
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
    const [emailed, setEmailed] = useState(false)
    const [email, setEmail] = useState('')
    const [invalidEmailMessage, setInvalidEmailMessage] = useState('')
    const [submittingEmail, setSubmittingEmail] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false)

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

    const handleChange = (e) =>{
        setEmail(e.target.value)
    }

    const handleOnBack = (e) =>{
        const user = JSON.parse(sessionStorage.getItem("user"))
        if (user.role === 'Operator')
            history.push('/operator')
        if ((user.role === 'Agent'))
            history.push('/agent')
    }

    const handleSubmitEmail = async (e) =>{
        e.preventDefault();
        if(email === ""){
            setInvalidEmailMessage("Email address cannot be empty.")
            setSubmittingEmail(false)
            setErrorEmail(true)
            return
        }
        if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setInvalidEmailMessage("Invalid email.")
            setSubmittingEmail(false)
            setErrorEmail(true)
            return
        }
        
        else{
            setSubmittingEmail(true)
            const data = {
                emailAddress: email,
                link: link
            }
            const url = `${settings.apiRoot}/api/v1/RegistrationCode/sendRegistrationLinkEmail`;
            const response = await adapter.Post(url,data)
            if(response.ok){
                const jsonResponse = await response.json()
                setErrorEmail(false)
                setEmailed(true)
                setSubmittingEmail(false)
                setEmail('')
                setLink('')
            }
            else{
                setSubmittingEmail(false)
            }
        }
    }

    return(
        <div>
            <Navbar title={"Registration Link"}/>
            <Container maxWidth="xs">
                <Grid container className="container-style">
                    <Grid item xs={12} sm={12}>
                        <Button onClick={handleGenerateLink} startIcon={fetching ? <FaSpinner className="spinner"/> : <LinkIcon />} variant="contained" color="primary">Generate Link</Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextareaAutosize value={link} disabled className="text-area-style" aria-label="minimum height" rowsMin={3} placeholder="No link available" />
                    </Grid>
                    <Grid item xs={8} sm={8}>
                        <TextField style={{marginTop: '20px'}} 
                        value={email}
                        onChange={handleChange} 
                        fullWidth id="outlined-basic"
                        type="email"
                        label="Email Address" 
                        variant="outlined" 
                        size='small'
                        error={errorEmail}
                        className="form-input-style"
                        helperText={errorEmail ? invalidEmailMessage : ""} />
                    </Grid>
                    <Grid container justify="center" spacing={5} style={{marginTop: '20px'}}>
                        <Grid item xs={6} sm={6}>
                            <Button startIcon={<EmailIcon />} fullWidth variant="contained" color="primary" 
                                    onClick={handleSubmitEmail} 
                                    disabled={submittingEmail}
                                    startIcon={submittingEmail && <FaSpinner className="spinner" />}
                                    disabled={link == "" ? true:false}>Email Link</Button>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                                <Button disabled={link == "" ? true:false} endIcon={<FileCopyIcon />} fullWidth variant="outlined" color="primary">Copy Link</Button>
                            </CopyToClipboard>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} className="generate-button-container">
                        <Button style={{marginTop: '50px'}} onClick={handleOnBack} variant="contained" color="primary" >Back</Button>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={copied}
                onClose={()=> setCopied(false) }
                autoHideDuration={3000}
            >
                <Alert severity="success">Copied to clipboard!</Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={emailed}
                onClose={()=> setEmailed(false)}
                autoHideDuration={3000}
            >
                <Alert severity="success">Emailed Link!</Alert>
            </Snackbar>
        </div>
    )
}