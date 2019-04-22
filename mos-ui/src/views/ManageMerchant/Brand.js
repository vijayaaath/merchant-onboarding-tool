import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import classnames from 'classnames';
import {
  Row, Col, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardHeader, CardFooter, CardBody, Collapse, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Alert,TabContent, TabPane, Nav, NavItem, NavLink, Badge } from 'reactstrap';
//import AddBrand from './AddBrand'
import AddBrand from './AddBrand'
import ViewBrand from './ViewBrand'


class ManageMerchant extends Component {


	 constructor(props) {
    super(props);
    this.state = {
      msg: ''
    };
  }




	componentDidMount()
	{ 
      this.setState({msg: this.props.msg});
	}

  componentWillReceiveProps(nextProps)
  {
    if(this.props != nextProps)
    {
      this.setState({msg: nextProps.msg});
    }
  }

  render() {
    return (
      <ViewBrand msg={this.state.msg} {...this.props}/>
	      	
    )
  }
}

export default ManageMerchant;
