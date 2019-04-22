import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../../api-config';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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


function saveUserValidate(name, email, password, role, selectedaccounts) {
  // true means invalid, so our conditions got reversed
  if(role == '0')
  {
  	var roleError = true;
  }
  else
  {
  	var roleError = false;
  }
  return {
    name: name.length === 0,
    email: email.length === 0,
    password: password.length === 0,
    role: roleError,
    selectedaccounts: selectedaccounts.length === 0,
  };
}



class UserDetail extends Component {


	 constructor() {
    super();
    this.state = {
      roles: [],
      name: '',
      email: '',
      password: '',
      selectedRole:'0',
      isDisabledname: false,
      isDisabledemail: false,
      isDisabledpassword: false,
      isDisabledSelectedrole: false,
      showsuccess: false,
      uid:'',
      selectedAccounts: [],
      accounts: [],
      isDisabledSelectedselectedaccounts: false
  	};
  	this.handleNameChange = this.handleNameChange.bind(this);
  	this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSelectedroleChange = this.handleSelectedroleChange.bind(this);
    this.handleUserSubmit = this.handleUserSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleAccounts = this.handleAccounts.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }


	componentDidMount()
	{
		this.loadroles();
	}


	loadroles()
	{
		var auth = localStorage.getItem('auth');
		var self = this;



		var body = {};
		axios({
        method: 'get',
        url: API_ROOT+'api/roles',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

		    })
		    .then(function (response) {
		     self.setState({roles:response.data.content});
		  })
		  .catch(function (error) {
	 	     self.setState({roles:[]});
		  }.bind(this));	 

      if(self.props.match.params.uid != undefined)
      {

          axios({
          method: 'get',
          url: API_ROOT+'api/users/'+self.props.match.params.uid,
          data: body,
          headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

          })
          .then(function (response) {
           self.setState({name: response.data.name});
           self.setState({email: response.data.email});
           self.setState({selectedRole: response.data.role[0].role});

           response.data.merchants.map((obj, key)=> {
            self.setState({selectedAccounts: [...self.state.selectedAccounts, {value: obj.merchantId,label: obj.name}]});
            })
              

        })
        .catch(function (error) {
           self.setState({roles:[]});
        }.bind(this));

      }


      axios({
        method: 'get',
        url: API_ROOT+'api/merchants/distinct',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
          response.data.map((obj, key)=> {            
           self.setState({accounts: [...self.state.accounts, {value: obj.merchant_id,label: obj.name}]});
      });
      })
      .catch(function (error) {
      }.bind(this)); 

	}

  handleNameChange(event) {
  	this.setState({name: event.target.value});
  	this.setState({isDisabledname: false});
  }

  handleEmailChange(event) {
  	this.setState({email: event.target.value});
  	this.setState({isDisabledemail: false});
  }

  handlePasswordChange(event) {
  	this.setState({password: event.target.value});
  	this.setState({isDisabledpassword: false});
  }

  handleSelectedroleChange(event) {
  	this.setState({selectedRole: event.target.value});
  	this.setState({handleSelectedroleChange: false});
  }

  handleUserSubmit(evt){


    if(this.props.match.params.uid != undefined)
    {
        var auth = localStorage.getItem('auth');
        var newPwd = this.state.password;
        if(newPwd == '')
        {
          var self = this;

          const json = [];
        
          self.state.selectedAccounts.map((obj, key)=> {
            json.push({
              "merchantId": obj.value
          });
        })
            var body = {
              "name":self.state.name,
             "email" : self.state.email,
             "tenantName" : localStorage.getItem('tenantName'),
             "role" : [ {
               "role" : self.state.selectedRole
             } ],
             "merchants" : json
          };


                axios({
              method: 'patch',
              url: API_ROOT+'api/users/'+self.props.match.params.uid,
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {
                 const { history } = self.props;
                  history.push('/admin/userlist');
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));
        }
        else
        {
            var self = this;


            const json = [];
        
            self.state.selectedAccounts.map((obj, key)=> {
              json.push({
                "merchantId": obj.value
            });
          })


              var body = {
              "name":self.state.name,
             "email" : self.state.email,
             "tenantName" : localStorage.getItem('tenantName'),
             "password" : self.state.password,
             "role" : [ {
               "role" : self.state.selectedRole
             } ],
             "merchants" : json
          };


                axios({
              method: 'patch',
              url: API_ROOT+'api/users/'+self.props.match.params.uid,
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {
                 const { history } = self.props;
                  history.push('/admin/userlist');
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));   

        }
    }
    else
    {
          if (!this.userCanBeSubmitted()) {
          evt.preventDefault();
          return;
        }

        var self = this;
        var auth = localStorage.getItem('auth');
        
        const json = [];
        
          self.state.selectedAccounts.map((obj, key)=> {
            json.push({
              "merchantId": obj.value
          });
        })

        var body = {
          "name":this.state.name,
         "email" : this.state.email,
         "tenantName" : localStorage.getItem('tenantName'),
         "password" : this.state.password,
         "role" : [ {
           "role" : this.state.selectedRole
         } ],
         "merchants" : json
      };



        return  axios({
            method: 'post',
            url: API_ROOT+'api/users',
            data: body,
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

          })
          .then(function (response) { 
            toast.success("User created successfully !", {
              position: toast.POSITION.TOP_CENTER
            });
        
        })
        .catch(function (error) {
        
        }.bind(this));
    }

  }

  userCanBeSubmitted() {

    if(this.state.selectedRole == 'USER'){
      if(this.state.selectedAccounts.length == 0){
        var selectedaccounts = '';
      }
      else{
        var selectedaccounts = '1';
      }
    }
    else{
      var selectedaccounts = '1';
    }


    const errors = saveUserValidate(this.state.name, this.state.email, this.state.password, this.state.selectedRole, selectedaccounts);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledname: errors.name});
    this.setState({isDisabledemail: errors.email});
    this.setState({isDisabledpassword: errors.password});
    this.setState({isDisabledSelectedrole: errors.role});
    this.setState({isDisabledSelectedselectedaccounts: errors.selectedaccounts});
    return !isDisabled;
  }

  handleReset()
  {
  	this.setState({name: ''});
  	this.setState({email: ''});
  	this.setState({password: ''});
  	this.setState({selectedRole: '0'});
  }


  handleCancel()
  {
    const { history } = this.props;
    history.push('/admin/userlist');
  }

  handleAccounts(selectedAccounts)
  {
    this.setState({ selectedAccounts });
    this.setState({isDisabledSelectedselectedaccounts : false});
  }



  render() {
    const accounts = [
      { value: 'Pedro', label: 'Pedro' },
      { value: 'Martina', label: 'Martina' }
    ];
    const { selectedAccounts } = this.state;
    return (
      <div className="animated fadeIn">
	      	{this.state.showsuccess == true ? <Alert color="success">
	           User created successfully.
	        </Alert> : "" }

         <Row>
          <Col xs="12" md="6">
          <h3>Create User</h3>
            <Card className="card-border">
              <CardHeader className="white-bg">
               
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" className={this.state.isDisabledname ? "error" : ""} id="text-input" name="text-input" placeholder="Name" onChange={this.handleNameChange} value={this.state.name}/>
                      <FormText color="muted">Enter name of the user</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="email-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="email" className={this.state.isDisabledemail ? "error" : ""} id="email-input" name="email-input" placeholder="Enter Email" onChange={this.handleEmailChange} value={this.state.email}/>
                      <FormText className="help-block">Enter email</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="password-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" className={this.state.isDisabledpassword ? "error" : ""} id="password-input" name="password-input" placeholder="Password" onChange={this.handlePasswordChange} value={this.state.password}/>
                      <FormText className="help-block">Enter password</FormText>
                    </Col>
                  </FormGroup>
                 
                 
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Select Role</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="select" className={this.state.isDisabledSelectedrole ? "error" : ""} id="select" onChange={this.handleSelectedroleChange} value={this.state.selectedRole}>
                        <option value="0">Please select</option>
                      	{
                      		this.state.roles.map((obj, key)=> {
                      				return (
                      						<option value={obj.role}>{obj.role}</option>	
                      					);
                      			})
                      	}
                      </Input>
                    </Col>
                  </FormGroup>

                  {this.state.selectedRole == 'USER' ? <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Select Account</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                          name="form-field-name"
                          value={this.state.selectedAccounts}
                          multi={true}
                          placeholder="Select"
                          onChange={this.handleAccounts}
                          options={this.state.accounts}
                          className={this.state.isDisabledSelectedselectedaccounts ? "error" : ""}
                        />
                    </Col>
                  </FormGroup> : <span></span> }
                    



                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.handleUserSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                {this.props.match.params.uid != undefined ? <Button type="reset" size="sm" color="danger" onClick={this.handleCancel}><i className="fa fa-ban"></i> Cancel</Button> : <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>}
                <ToastContainer autoClose={10000} />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default UserDetail;
