import React from 'react'
import logo from '../logo.png';
import Footer from './common/Footer';
import './css/Home.css'
import settings from '../settings';
import adapter from '../utils/adapter'
import Message from './common/Message';
import {FaSpinner} from 'react-icons/fa'
import { Container, TextField, Button } from '@material-ui/core';

const initialState = {
    email: "",
    password: "",
    emailError:"",
    passwordError: "",
    submitting:false,
    message: "",
    messageType: "",
}

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }

    onSubmit = async (e) => {        
        e.preventDefault();
        const isValid = this.validate();

        if (isValid) {
            //call signin api
            const url = `${settings.apiRoot}/api/registration/v1/user/authenticate`;
            const content = {
                email: this.state.email,
                password: this.state.password,
            };
            this.setState({message: ""})
            this.setState({submitting :true});
            const response = await adapter.Post(url, content);
            this.setState({submitting :false});
            
            if (!response.ok) {
                this.setState({
                    message: "Invalid credentials", //response.status
                    messageType: "error"
                });
            } else {
                this.props.history.push("/operator");
            }
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () => {
        let emailError = "";
        let passwordError = "";

        if (!this.state.email) {
            emailError = "Email is required.";
        }

        if (!this.state.password) {
            passwordError = "Password is required.";
        }

        if (emailError || passwordError) {
            this.setState({ emailError, passwordError });
            return false;
        }

        return true;
    }

    render() {
        const {submitting} = this.state;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                <header className="home-header">
                    <img src={logo} className="app-logo" alt="logo" />
                </header>
                <div style={{marginBottom: '15px'}}>
                    {this.state.message !== "" ? 
                    <Message text={this.state.message} messageType={this.state.messageType} />
                    :
                    ''
                    }
                </div>
                <form onSubmit={this.onSubmit}>
                        <TextField
                            onChange={this.onChange}
                            error={this.state.emailError !== "" ? true : false}
                            fullWidth
                            id="email"
                            type="email"
                            label="Email"
                            helperText={this.state.emailError}
                            variant="outlined"
                            className="form-input-style"
                            style={{margin: '10px 0px'}}
                        />
                        <TextField
                            onChange={this.onChange}
                            error={this.state.passwordError !== "" ? true : false}
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            helperText={this.state.passwordError}
                            variant="outlined"
                            className="form-input-style"
                            style={{margin: '10px 0px'}}
                        />
                        <Button 
                            fullWidth 
                            variant="contained" 
                            color="primary" 
                            style={{margin: '10px 0px'}} 
                            type="submit" 
                            disabled={submitting} 
                            startIcon={submitting && <FaSpinner className="spinner"/>}>
                            Submit{submitting && 'ing'}
                        </Button>
                </form>
                {/* <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" value={this.state.email} className="form-control" id="email" onChange={this.onChange} />
                        <span className="text-danger">
                            {this.state.emailError}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={this.state.password} className="form-control" id="password" onChange={this.onChange} />
                        <span className="text-danger">
                            {this.state.passwordError}
                        </span>
                    </div>
                    <div className="center-content pt-4">
                            <button type="submit" className="btn btn-primary  mr-4" value="Sign In" disabled={submitting}>
                            { submitting && <FaSpinner className="spinner"/>} Submit
                        </button>          
                    </div>
                </form> */}
                <Footer />
                </Container>
            </div>
        );
    }
}

export default Home;