import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../../api-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Row,
  Col,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert
} from 'reactstrap';


function saveUserValidate(password) {
  return {
    password: password.length === 0,
  };
}



class UserProfile extends Component {


	 constructor() {
    super();
    this.state = {     
      name:'',
      email: '',
      password: '',
      isDisabledPassword: false
    };
    this.handleUserSubmit = this.handleUserSubmit.bind(this);
    this.loadprofile = this.loadprofile.bind(this);
    this.userCanBeSubmitted = this.userCanBeSubmitted.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

  }

  componentDidMount(){
		this.loadprofile();
  }


  
  loadprofile(){
    var auth = localStorage.getItem('auth');
    var self = this;
    var uid = localStorage.getItem("userId");
    var body = {};
    axios({
      method: 'get',
      url: API_ROOT+'api/users/'+uid,
      data: body,
      headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

      })
      .then(function (response) {
       self.setState({name: response.data.name});
       self.setState({email: response.data.email});

    })
    .catch(function (error) {
       self.setState({roles:[]});
    }.bind(this));   

  }




  handlePasswordChange(event){
    this.setState({password: event.target.value});
  	this.setState({isDisabledPassword: false});
  }




  userCanBeSubmitted(){
    const errors = saveUserValidate(this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledPassword: errors.password});
    return !isDisabled;
  }



  handleUserSubmit(evt){
    if (!this.userCanBeSubmitted()) {
      evt.preventDefault();
      return;
    }

    var auth = localStorage.getItem('auth');
    var self = this;
    var uid = localStorage.getItem("userId");
    var body = {
      "password" : self.state.password,
      "tenantName" : localStorage.getItem('tenantName'),
      "name":self.state.name,
      "email" : self.state.email,
    };
    axios({
      method: 'patch',
      url: API_ROOT+'api/users/'+uid,
      data: body,
      headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

      })
      .then(function (response) {
        var auth = 'Basic '+btoa(""+self.state.email+":"+self.state.password+"");
        localStorage.setItem('auth', auth);            
          toast.success("Password updated successfully !", {
            position: toast.POSITION.TOP_CENTER
          });
          self.setState({password: ''});
       
    })
    .catch(function (error) {
       //self.setState({roles:[]});
    }.bind(this));     
  }


  render() {
    return (
      <div className="animated fadeIn">
	      

         <Row>
          <Col xs="12" md="6">
          <h3>Profile</h3>
            <Card className="card-border">
              <CardHeader className="white-bg">
                
              </CardHeader>
              <CardBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input1" name="text-input" placeholder="Name" value={this.state.name} readonly className="form-control-plaintext"/>
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>

                   <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input2" name="text-input" placeholder="Email" value={this.state.email} readonly className="form-control-plaintext"/>
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>

                   <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="text-input3" name="text-input" placeholder="Password" onChange={this.handlePasswordChange} value={this.state.password}  className={this.state.isDisabledPassword ? "error" : ""}/>
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>
               
              </CardBody>
              <CardFooter className="border-top-none">
              <Button type="submit" size="sm" color="primary" onClick={this.handleUserSubmit}><i className="fa fa-dot-circle-o"></i> Update</Button>
              <ToastContainer autoClose={10000} />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default UserProfile;
