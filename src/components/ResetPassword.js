import React, { useState } from 'react'
import logo from '../logo.png';
import Message from './common/Message';
import { FaLessThanEqual, FaSpinner } from 'react-icons/fa'
import { Container, TextField, Button, Dialog, DialogContent } from '@material-ui/core';
import settings from '../settings';
import adapter from '../utils/adapter'
import { set } from 'date-fns';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function ResetPassword(){
    const history = useHistory()
    const [values, setValues] = useState({
        email:"",
        code:"",
        password:"",
        password2:"",
    })
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorCode, setErrorCode] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorPassword2, setErrorPassword2] = useState(false)
    const [emailMessage, setEmailMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [submittingEmail, setSubmittingEmail] = useState(false)
    const [submittingCredentials, setSubmittingCredentials] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [credentialsMessage, setCredentialsMessage] = useState('')


    const handleChange = (e) =>{
        setErrorEmail(false)
        setErrorCode(false)
        setErrorPassword(false)
        setErrorPassword2(false)
        setValues({...values, [e.target.id]: e.target.value})
    }

    const handleSubmitEmail = async (e) =>{
        sessionStorage.removeItem('user');
        const cookies = new Cookies();
        cookies.remove('user');
    
        e.preventDefault();
        if(values.email === ""){
            setErrorEmail(true)
            setEmailMessage("Email is required.")
            setMessageType("error")
        }
        if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            setErrorEmail(true)
            setEmailMessage("Invalid email.")
            setMessageType("error")
        }
        else{
            setSubmittingEmail(true)
            const data = {
                emailAddress: values.email
            }
            const url = `${settings.apiRoot}/api/registration/v1/user/sendPasswordResetEmail`;
            const response = await adapter.Post(url,data)
            if(response.ok){
                const jsonResponse = await response.json()
                setSubmittingEmail(false)
                setErrorEmail(false)
                setEmailMessage("A code was sent to your email to reset your password")
                setMessageType("success")
            }
            else{
                setSubmittingEmail(false)
                setErrorEmail(true)
                setEmailMessage("Invalid Email")
                setMessageType("error")
            }
        }
    }

    const handleSubmitValues = async (e) =>{
        e.preventDefault()
        if(values.code === "" && values.password === "" && values.password2 === ""){
            setErrorCode(true)
            setErrorPassword(true)
            setErrorPassword2(true)
        }
        else if(values.code === ""){
            setErrorCode(true)
        }
        else if(values.password === ""){
            setErrorPassword(true)
        }
        else if(values.password2 === ""){
            setErrorPassword2(true)
        }
        else{
            sessionStorage.removeItem('user');
            const cookies = new Cookies();
            cookies.remove('user');
    
            setSubmittingCredentials(true)
            const data = {
                email: values.email,
                password: values.password,
                code: values.code
            }
            const url = `${settings.apiRoot}/api/registration/v1/user/changePassword`;
            const response = await adapter.Post(url,data)
            if(response.ok){
                const jsonResponse = await response.json()
                setSubmittingCredentials(false)
                setOpenDialog(true)
            }
            else{
                setSubmittingCredentials(false)
                setCredentialsMessage("Invalid Credentials")
                setMessageType("error")
            }
        }

    }

    const handleRedirect = () =>{
        setOpenDialog(false)
        history.push('/')
    }
    return(
        <div>
            <Container component="main" maxWidth="xs">
                <header className="login-header">
                    <img src={logo} className="app-logo" alt="logo" />
                </header>
                <div style={{ marginBottom: '15px' }}>
                        {
                            emailMessage !=="" ?
                            <Message text={emailMessage} messageType={messageType} />
                            :
                            ''
                        }
                </div>
                <form onSubmit={handleSubmitEmail} style={{marginBottom: '50px'}}>
                    <TextField
                        value={values.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="email"
                        label="Email"
                        id="email"
                        className="form-input-style"
                        error={errorEmail}
                        helperText={errorEmail ? "Email is required.": ""}
                        size='small'
                        style={{ margin: '10px 0px' }}
                    />
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        <Button
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            color="primary"
                            disabled={submittingEmail}
                            startIcon={submittingEmail && <FaSpinner className="spinner" />}
                        >
                            {submittingEmail? "Requesting":"Request Reset"}
                        </Button>
                    </div>
                </form>
                <div style={{ marginBottom: '15px' }}>
                        {
                            credentialsMessage !=="" ?
                            <Message text={credentialsMessage} messageType={messageType} />
                            :
                            ''
                        }
                </div>
                <form onSubmit={handleSubmitValues}>
                    <TextField 
                        value={values.code}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Code"
                        id="code"
                        className="form-input-style"
                        error={errorCode}
                        helperText={errorCode ? "Code is required.":""}
                        style={{ margin: '10px 0px' }}
                        size='small'
                    />
                    <TextField 
                        value={values.password}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="password"
                        label="New password"
                        id="password"
                        className="form-input-style"
                        error={errorPassword}
                        helperText={errorPassword ? "Password is required.":""}
                        style={{ margin: '10px 0px' }}
                        size='small'
                    />
                    <TextField 
                        value={values.password2}
                        onChange={handleChange} 
                        fullWidth
                        variant="outlined"
                        type="password"
                        label="Confirm Password"
                        id="password2"
                        className="form-input-style"
                        error={errorPassword2}
                        helperText={errorPassword2 ? "Confirm Password is required.":""}
                        style={{ margin: '10px 0px' }}
                        size='small'
                    />
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        <Button
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            color="primary"
                            disabled={submittingCredentials}
                            startIcon={submittingCredentials && <FaSpinner className="spinner" />}
                            >
                            Reset
                        </Button>
                    </div>
                </form>
            </Container>
            <Dialog open={openDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    Password Successfully change!
                    <Button variant="outlined" style={{margin: '20px 0px'}} fullWidth onClick={handleRedirect}>OK</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}