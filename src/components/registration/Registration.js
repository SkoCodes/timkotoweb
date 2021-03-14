import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import Footer from '../common/Footer';
import '../css/Registration.css';

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
    redirectToSuccess: false
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
            const res = await fetch("https://api.timkoto.com/dev/api/registration/v1/User", {
                method : "POST",
                headers : {
                    "Content-type" : "application/json",
                    "x-api-key" : "jVq8KNLxQ52I7cWrmnDDT5bCTx3BDmza1l3MeTFJ",   
                    "Access-Control-Allow-Origin" : "*"
                },
                body: JSON.stringify({"emailAddress" : "test"})
            });

            const data = res.json();

            console.log(data);

            //this.props.history.push("/registersuccess");
        }

    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () => {
        console.log(this.state);
        let emailAddressError = "";
        let passwordError = "";
        let confirmPasswordError = "";
        let nameError = "";

        if (!this.state.emailAddress) {
            emailAddressError = "Email address cannot be blank.";
        }

        if (this.state.emailAddress && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.emailAddress)) {
            emailAddressError = "Invalid email format."
        }

        if (!this.state.password) {
            passwordError = "Password is required.";
        }

        if (this.state.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(this.state.password)) {
            passwordError = "Password must be at least 8 characters with 1 number and 1 letter.";
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

        if (this.state.name && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,30}$/i.test(this.state.name)) {
            nameError = "Name must be at least 2 characters with 1 number and 1 letter.";
        }

        if (emailAddressError || passwordError || confirmPasswordError || nameError) {
            this.setState({ emailAddressError, passwordError, confirmPasswordError, nameError });
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="container">
                <header className="center-content">
                    <Link to="/">
                        <img src={logo} className="app-logo" alt="logo" />
                    </Link>
                </header>
                <main>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="emailAddress">Email Address:</label>
                            <input type="text"
                                className="form-control"
                                id="emailAddress"
                                placeholder="Email Address"
                                value={this.state.emailAddress}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.emailAddressError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.passwordError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={this.state.confirmPassword}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.confirmPasswordError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={this.state.name}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.nameError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input type="tel"
                                className="form-control"
                                id="phoneNumber"
                                placeholder="Phone Number"
                                value={this.state.phoneNumber}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.phoneNumberError}
                            </span>
                        </div>
                        <div className="center-content">
                            <input type="submit" value="Submit" className="btn btn-primary" />
                        </div>
                    </form>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Registration;