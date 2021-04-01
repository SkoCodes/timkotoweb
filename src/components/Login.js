import React from 'react'
import logo from '../logo.png';
import Footer from './common/Footer';
import './css/Login.css'
import Message from './common/Message';
import { FaSpinner } from 'react-icons/fa'
import { Container, TextField, Button } from '@material-ui/core';
import { authenticationService } from '../services/authenticationService';
import {withRouter} from 'react-router-dom'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    submitting: false,
    message: "",
    messageType: "",
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;        
    }
    //connect to websocket
    // componentWillMount() {
    //     client.onopen = () => {
    //       console.log('WebSocket Client Connected');
    //     };
    //     client.onmessage = (message) => {
    //       console.log(message);
    //     };
    //   }
      
    onSubmit = async (e) => {
        e.preventDefault();
        const isValid = this.validate();

        if (isValid) {
            this.setState({ message: "" })
            this.setState({ submitting: true });
            const user = await authenticationService.loginUser(this.state.email, this.state.password);
            this.setState({ submitting: false });

            if (user === null) {
                this.setState({
                    message: "Invalid credentials.",
                    messageType: "error"
                });
            } else {
                switch (user.role) {
                    case "Operator":
                        this.props.history.push("/operator");
                        break;
                    case "Agent":
                        this.props.history.push("/agent");
                        break;
                    case "Player":
                        this.props.history.push("/player");
                        break;
                    default:
                        //do nothing
                        break;
                }
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
        const { submitting } = this.state;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                    <header className="login-header">
                        <img src={logo} className="app-logo" alt="logo" />
                    </header>
                    <div style={{ marginBottom: '15px' }}>
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
                            style={{ margin: '10px 0px' }}
                            size='small'
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
                            style={{ margin: '10px 0px' }}
                            size='small'
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '10px 0px' }}
                            type="submit"
                            disabled={submitting}
                            startIcon={submitting && <FaSpinner className="spinner" />}>
                            Submit{submitting && 'ting'}
                        </Button>
                    </form>
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        <Button fullWidth onClick={()=> this.props.history.push('/reset-password')} variant="outlined">Forgot Password</Button>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withRouter(Login);