import React from 'react'
import logo from '../logo.png';
import Footer from './common/Footer';
import './css/Home.css'
import settings from '../settings';
import adapter from '../utils/adapter'
import { Message, messageType } from './common/Message';
import {FaSpinner} from 'react-icons/fa'

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
            
            this.setState({submitting :true});
            const response = await adapter.Post(url, content);
            this.setState({submitting :false});
            
            if (!response.ok) {
                this.setState({
                    message: "Invalid password", //response.status
                    messageType: messageType.danger
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
                <header className="home-header">
                    <img src={logo} className="app-logo" alt="logo" />
                </header>
                <main className="container home-content">
                <Message text={this.state.message} messageType={this.state.messageType} />
                    <form onSubmit={this.onSubmit}>
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
                    </form>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Home;