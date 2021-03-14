import React from 'react'
import logo from '../logo.png';
import Footer from './common/Footer';
import './css/Home.css'

const initialState = {
    userName: "",
    password: "",
    userNameError:"",
    passwordError: ""
}

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }

    onSubmit = (e) => {        
        e.preventDefault();
        const isValid = this.validate();

        if (isValid) {
            //call signin api

            this.props.history.push("/player");
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () => {
        let userNameError = "";
        let passwordError = "";

        if (!this.state.userName) {
            userNameError = "User name is required.";
        }

        if (!this.state.password) {
            passwordError = "Password is required.";
        }

        if (userNameError || passwordError) {
            this.setState({ userNameError, passwordError });
            return false;
        }

        return true;
    }

    render() {
        return (
            <div>
                <header className="home-header">
                    <img src={logo} className="app-logo" alt="logo" />
                </header>
                <main className="container home-content">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">User Name</label>
                            <input type="text" value={this.state.userName} className="form-control" id="userName" onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.userNameError}
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
                            <input type="submit" value="Sign In" className="btn btn-primary mr-4" />
                        </div>
                    </form>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Home;