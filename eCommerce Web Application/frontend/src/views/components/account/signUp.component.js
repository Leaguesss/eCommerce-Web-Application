import React from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

class RegistrationForm extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            API_BASE_URL: "http://localhost:5000/account/api/",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            successMessage: null,
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.sendDetailsToServer = this.sendDetailsToServer.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
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

        if (!this.state.firstName) {
            formIsValid = false;
            errors["firstname"] = "First Name field cannot be empty";
        }

        if (!this.state.lastName) {
            formIsValid = false;
            errors["lastname"] = "Last Name field cannot be empty";
        }

        if (typeof this.state.firstName !== "undefined" && !this.state.firstName === false) {
            if (!this.state.firstName.match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["firstname"] = "Only allow letters";
            }
        }

        if (typeof this.state.lastName !== "undefined" && !this.state.lastName === false) {
            if (!this.state.lastName.match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["lastname"] = "Only allow letters";
            }
        }

        if (!this.state.email) {
            formIsValid = false;
            errors["email"] = "Email field cannot be empty";
        }

        if (typeof this.state.email !== "undefined" && !this.state.email === false) {
            var lastAtPos = this.state.email.lastIndexOf('@');
            var lastDotPos = this.state.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        //console.log("password: ", this.state.password);
        if (!this.state.password) {
            formIsValid = false;
            errors["password"] = "Password field cannot be empty";
        }
        if (!this.state.confirmPassword) {
            formIsValid = false;
            errors["confirmpassword"] = "Confirm password field cannot be empty";
        }

        if ((this.state.password !== this.state.confirmPassword)) {
            formIsValid = false;
            errors["confirmpassword"] = "Passwords do not match";
        }

        if (typeof this.state.password !== "undefined" && !this.state.password === false) {
            var errorMsg = [];
            if (this.state.password.length < 8) { formIsValid = false; errorMsg.push(" more than 8 chars"); }
            if (this.state.password.toLowerCase === this.state.password) { formIsValid = false; errorMsg.push(" at least 1 big letter"); }
            if (!(/\d/.test(this.state.password))) { formIsValid = false; errorMsg.push(" at least 1 digit"); }
            var specialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            if (!(specialChar.test(this.state.password))) { formIsValid = false; errorMsg.push(" at least 1 special char"); }

            if (errorMsg.length > 0) {
                errors["password"] = "Ensure you password has";
                for (var item in errorMsg) {
                    errors["password"] += errorMsg[item];
                }
            }

        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    sendDetailsToServer = async() => {
        if (this.state.firstName.length && this.state.lastName.length && this.state.email.length && this.state.password.length
            && this.state.confirmPassword.length) {
            this.props.showError(null);
            var md5 = require('md5');

            const newUser = {
                "firstname": this.state.firstName,
                "lastname": this.state.lastName,
                "email": this.state.email,
                "password": md5(this.state.password),
            }
            console.log(newUser);

            var that = this;

            await axios.post(this.state.API_BASE_URL + 'register', newUser)
                .then(async function (response) {
                    console.log(response.data);
                    if (response.status === 200) {
                        that.setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Registration successful. Redirecting to home page..'
                        }))
                        //that.context.getLoggedIn();

                        const {logState} = that.context;
                        const [loggedIn, getLoggedIn] = logState;
                        getLoggedIn();

                        that.redirectToHome();
                        that.props.showError(null)
                    } 
                })
                .catch(function (error) {
                    if (error.response) {
                        //console.log(error.response.data); // => the response payload 
                        that.props.showError(error.response.data);
                    }
                });
        } else {
            this.props.showError('All fields are required! No empty input!')
        }

    }
    redirectToHome = () => {
        this.props.history.go(-2);
    }
    redirectToLogin = () => {
        this.props.showError(null);
        this.props.history.push('/auth/login');
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
            <div className="card col-12 register-card col-lg-4 mt-5 hv-center">
                <div className="formTitle card-header bg-primary text-white">
                    <span className="h3">Login</span>
                </div>
                <form className="card-body px-4 py-3 registrationForm">
                    <div className="inputBox form-group text-left">
                        <label htmlFor="firstName">Firstname: </label>
                        <input type="text"
                            required
                            className="form-control"
                            placeholder="Enter your firstname"
                            id="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                        />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["firstname"]}</span>
                    </div>
                    <div className="inputBox form-group text-left">
                        <label htmlFor="lastName">Lastname</label>
                        <input type="text"
                            required
                            className="form-control"
                            id="lastName"
                            placeholder="Enter your lastname"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                        />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["lastname"]}</span>
                    </div>
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
                        <small id="pwdHelp" className="errorInfo form-text text-muted">
                            <i>Password must be at least 8 chars, have at least 1 big letter, 1 digit and 1 special char.</i>
                        </small>
                        <br />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </div>
                    <div className="inputBox form-group text-left">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password"
                            required
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                        />
                        <span className="errorInfo" style={{ color: "red" }}>{this.state.errors["confirmpassword"]}</span>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-outline-primary btn-lg"
                            onClick={this.handleSubmitClick}
                        >
                            Register
                    </button>
                    </div>

                </form>
                <div className="alert alert-success mt-2" style={{ display: this.state.successMessage ? 'block' : 'none' }} role="alert">
                    {this.state.successMessage}
                </div>
                <div className="inputBox mt-2">
                    <span><i>Already have an account? </i></span>
                    <span className="loginText" onClick={() => this.redirectToLogin()}><i><u>Login here</u></i></span>
                </div>

            </div>
            
        )
    }
}

export default withRouter(RegistrationForm);