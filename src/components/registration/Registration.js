import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import Message from '../common/Message';
import '../css/Registration.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import {FaSpinner} from 'react-icons/fa'
import { Container, TextField, Button } from '@material-ui/core';
import InputMask from 'react-input-mask'

const initialState = {
    emailAddress: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    emailAddressError: "",
    passwordError: "",
    confirmPasswordError: "",
    nameError: "",
    message: "",
    messageType: "",
    submitting:false    
};

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const isValid = this.validate();

        if (isValid) {            
            const url = `${settings.apiRoot}/api/registration/v1/User`;
            const content = {
                email: this.state.emailAddress,
                userName: this.state.name,
                phoneNumber: this.state.phoneNumber,
                password: this.state.password,
                registrationCode: this.props.match.params.code
            };

            this.setState({submitting :true});
            const response = await adapter.Post(url, content);
            this.setState({submitting :false});

            if (response.ok) {
                this.props.history.push("../login");
            }
            if (response.status === 403) {
                const jsonResponse = await response.json();
                this.setState({
                    message: jsonResponse.result.description,
                    messageType: "error"
                });
            }
            else{
                this.setState({
                    message: "An error occured, please contact your agent.",
                    messageType: "error"
                });
            }
        }
    }

    onLoginClick = (e) =>{
        e.preventDefault()
        this.props.history.push("../login")
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () => {        
        let emailAddressError = "";
        let passwordError = "";
        let confirmPasswordError = "";
        let nameError = "";

        if (!this.state.emailAddress) {
            emailAddressError = "Email address cannot be blank.";
        }

        if (this.state.emailAddress && !/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(this.state.emailAddress)) {
            emailAddressError = "Invalid email."
        }

        if (!this.state.password) {
            passwordError = "Password is required.";
        }

        if (this.state.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(this.state.password)) {
            passwordError = "Password must be at least 8 characters with atleast 1 number.";
        }

        if (!this.state.confirmPassword) {
            confirmPasswordError = "Confirm password is required.";
        }

        if (this.state.confirmPassword && (this.state.password !== this.state.confirmPassword)) {
            confirmPasswordError = "Confirm password does not match the provided password.";
        }

        if (!this.state.name) {
            nameError = "Name is required."
        }

        if (this.state.name && !/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*.{1,}$/i.test(this.state.name)) {
            nameError = "Name must be at least 2 characters.";
        }

        if (emailAddressError || passwordError || confirmPasswordError || nameError) {
            this.setState({ emailAddressError, passwordError, confirmPasswordError, nameError });
            return false;
        }

        return true;
    }

    render() {
        const {submitting} = this.state;        
        return (
            <div className="container">
                <header>
                    <div className="center-content">
                        <Link to="/">
                            <img src={logo} className="app-logo" alt="logo" />
                        </Link>
                    </div>
                </header>
                <Container component="main" maxWidth="xs">
                    <Message text={this.state.message} messageType={this.state.messageType} />
                    <form onSubmit={this.onSubmit}>
                        
                            <TextField
                                onChange={this.onChange}
                                error={this.state.emailAddressError !== "" ? true : false}
                                fullWidth
                                required
                                id="emailAddress"
                                type="email"
                                label="Email Address"
                                helperText={this.state.emailAddressError}
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                            />
                            <TextField
                                onChange={this.onChange}
                                error={this.state.passwordError !== "" ? true : false}
                                fullWidth
                                required
                                id="password"
                                type="password"
                                label="Password"
                                helperText={this.state.passwordError}
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                            />
                        
                            <TextField
                                onChange={this.onChange}
                                error={this.state.confirmPasswordError !== "" ? true : false}
                                fullWidth
                                required
                                id="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                helperText={this.state.confirmPasswordError}
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                            />
                        
                            <TextField
                                onChange={this.onChange}
                                error={this.state.nameError !== "" ? true : false}
                                fullWidth
                                required
                                id="name"
                                type="text"
                                label="Name"
                                helperText={this.state.nameError}
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                            />
                        
                            <InputMask
                                mask="0999-999-9999"
                                value={this.state.phoneNumber}
                                disabled={false}
                                maskChar=" "
                                onChange={this.onChange}>
                                {() => <TextField 
                                    size='small'
                                    type="text"
                                    variant="outlined" 
                                    className="form-input-style"
                                    style={{ margin: '10px 0px' }}
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                />}
                            </InputMask>
                            <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ margin: '10px 0px' }}
                                    type="submit"
                                    disabled={submitting}
                                    startIcon={submitting && <FaSpinner className="spinner" />}>
                                    Submit{submitting && 'ing'}
                            </Button>        
                            <hr></hr>               
                            <Button
                                    onClick={this.onLoginClick}
                                    fullWidth
                                    variant="outlined"
                                    color="primary">
                                    Login
                            </Button>     
                    </form>
                </Container>
                
            </div>
        );
    }
}

export default Registration;