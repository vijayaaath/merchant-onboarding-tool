import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, InputGroupText, Alert, Table} from 'reactstrap';
import axios from 'axios';
import { API_ROOT } from '../../api-config';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var btoa = require('btoa');

function validate(username, password) {
  // true means invalid, so our conditions got reversed
  return {
    username: username.length === 0,
    password: password.length === 0,
  };
}



class Login extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isDisabledusername: false,
      isDisabledusername: false,
      
      everFocusedEmail: false,
      everFocusedPassword: false,
      inFocus: '',
      alertmessage:false,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
    this.setState({isDisabledusername: false});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
    this.setState({isDisabledpassword: false});
  }

  handleSubmit(evt){
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }
    const { username, password } = this.state;
    const { history } = this.props;

    var uname = this.state.username;
    var pwd = this.state.password;

    var body = {
       "username" : uname,
       "password" : pwd,
       "submit" : "Login"
      };

    var auth = 'Basic '+btoa(""+uname+":"+pwd+"");
  
    return  axios({
        method: 'get',
        url: API_ROOT+'home',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
        localStorage.setItem('tenantName', response.data.tenant.name);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('role', response.data.role[0].role);        
        history.push('/dashboard');
        this.setState({alertmessage: false});
      })
      .catch(function (error) {
        toast.error("Incorrect Username (OR) Password", {
          position: toast.POSITION.TOP_CENTER
        });
   
      }.bind(this));

  }


  canBeSubmitted() {
    const errors = validate(this.state.username, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledusername: errors.username});
    this.setState({isDisabledpassword: errors.password});
    return !isDisabled;
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center login-bg">
        <div className="container-fluid login-div">
          <div className="row">
            <div className="col-sm">
              <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-12 float-lg-left float-xl-left float-md-left float-sm-none float-none login-left">
                <h1>Maya Commerce</h1>
                <h2>Use taste to connect merchants with<br/>consumers</h2>
              </div>
            </div>
            <div className="col-sm">
                <div className="col-lg-8 col-xl-8 col-md-7 col-sm-12 col-12 float-lg-right float-xl-right float-md-right float-sm-none float-none">
                
                <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" className={this.state.isDisabledusername ? "error login-input-padding" : "login-input-padding"} name="username" value={this.state.username} placeholder="Username" onChange={this.handleUsernameChange} onKeyPress={this._handleKeyPress} autoFocus="true"/>
                </InputGroup>

                 <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" className={this.state.isDisabledpassword ? "error login-input-padding" : "login-input-padding"} value={this.state.password} name="password" placeholder="Password" onChange={this.handlePasswordChange} onKeyPress={this._handleKeyPress}/>
                  </InputGroup>
                    <div className="mb-4 login-submit-button">                   
                        <Button color="primary" className="px-4 login-input-submit" onClick={this.handleSubmit}>Login</Button>          
                   </div>
                </div>
            </div>            
          </div>
        </div>
        <ToastContainer autoClose={7000} />
      </div>
    );
  }
}

export default Login;
