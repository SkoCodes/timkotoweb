import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png'
import Footer from './common/Footer';

const initialState = {
    userName: "",
    password: "",
    userNameError:"",
    passwordError: ""
}

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onSubmit = (e) =>{
        console.log('submitted');
        e.preventDefault();
        const isValid = this.validate();

        if(isValid){
            //call signin api

            this.props.history.push("/player");
        }
    }

    onChange = (e) =>{
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () =>{
        let userNameError ="";
        let passwordError ="";

        if(!this.state.userName){
            userNameError = "User name is required.";
        }

        if(!this.state.password){
            passwordError = "Password is required.";
        }

        if(userNameError || passwordError){
            this.setState({userNameError, passwordError});
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="container">
                <header>
                    <div className="center-content">
                        <Link to="/">
                            <img src={logo} className="app-logo" alt="logo" />
                        </Link>
                    </div>
                    <div className="center-content">
                        <h3>Signin</h3>
                    </div>
                </header>
                <main>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">User Name</label>
                            <input type="text" value={this.state.userName} className="form-control" id="userName" onChange={this.onChange}/>
                            <span className="text-danger">
                                {this.state.userNameError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" value={this.state.password} className="form-control" id="password" onChange={this.onChange}/>
                            <span className="text-danger">
                                {this.state.passwordError}
                            </span>
                        </div>
                        <div className="center-content">
                            <input type="submit" value="Sign In" className="btn btn-primary"/>
                        </div>
                    </form>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default Signin