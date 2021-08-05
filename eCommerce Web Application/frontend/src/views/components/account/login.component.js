import React from 'react';
import axios from 'axios';
import './LoginForm.css';
import './RegistrationForm.css';

import { withRouter } from "react-router-dom";
import AuthContext from "../../context/AuthContext";



class LoginForm extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            API_BASE_URL: "http://localhost:5000/account/api/",
            email: "",
            password: "",
            successMessage: null,
            errors: {},
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.sendDetailsToServer = this.sendDetailsToServer.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
        this.redirectToRegister = this.redirectToRegister.bind(this);
    }

    handleChange = (e) => {
        const { id, value } = e.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    handleValidation = () => {
        var errors = {};
        var formIsValid = true;

        if (!this.state.email) {
            formIsValid = false;
            errors["email"] = "Email field cannot be empty";
        }

        if (typeof this.state.email !== "undefined" && !this.state.email === false) {
            var lastAtPos = this.state.email.lastIndexOf('@');
            var lastDotPos = this.state.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email address is not valid";
            }
        }

        if (!this.state.password) {
            formIsValid = false;
            errors["password"] = "Password field cannot be empty";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    sendDetailsToServer = async() => {
        if (this.state.email.length && this.state.password.length) {
            this.props.showError(null);
            var md5 = require('md5');
            const loginInfo = {
                "email": this.state.email,
                "password": md5(this.state.password),
            }
            var that = this;
            await axios.post(this.state.API_BASE_URL + 'login', loginInfo)
                .then(async function (response) {
                    if (response.status === 200) {
                        that.setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Login successful. Redirecting to home page..'
                        }))
                        const { logState } = that.context;
                        const [loggedIn, getLoggedIn] = logState;
                        await getLoggedIn();
                        that.redirectToHome();
                        that.props.showError(null);
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data); // => the response payload 
                        that.props.showError(error.response.data);
                    }
                });
        } else {
            this.props.showError('All fields are required! No empty input!')
        }

    }

    redirectToHome = () => {
        this.props.history.goBack();
    }

    redirectToRegister = () => {
        this.props.showError(null);
        this.props.history.push('/auth/register');
    }

    handleSubmitClick = async (e) => {
        e.preventDefault();
        if (!this.handleValidation()) {
            this.props.showError('Correct your input!');
        } else {
            this.sendDetailsToServer();
        }
    }

    render() {
        return (
            <div className="card col-12 login-card col-lg-4 mt-5 hv-center">
                <div className="formTitle card-header bg-primary text-white">
                    <span className="h3">Login</span>
                </div>
                <form className="card-body px-4 py-3 registrationForm">
                    <div className="inputBox form-group text-left">
                        <label htmlFor="email">Email address</label>
                        <input type="email"
                            required
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["email"]}</span>
                    </div>
                    <div className="inputBox form-group text-left">
                        <label htmlFor="password1">Password</label>
                        <input type="password"
                            required
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            aria-describedby="emailHelp"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-outline-primary btn-lg"
                            onClick={this.handleSubmitClick}
                        >
                            Login
                    </button>
                    </div>
                </form>
                <div className="alert alert-success mt-2" style={{ display: this.state.successMessage ? 'block' : 'none' }} role="alert">
                    {this.state.successMessage}
                </div>
                <div className="inputBox mt-2">
                    <span><i>No account? </i></span>
                    <span className="loginText" onClick={() => this.redirectToRegister()}><i><u>Register here</u></i></span>
                </div>
            </div>
        )
    }
}

export default withRouter(LoginForm);