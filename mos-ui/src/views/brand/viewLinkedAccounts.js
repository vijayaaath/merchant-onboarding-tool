import React, { Component } from 'react';
import classnames from 'classnames';
import Loader from 'react-loader-spinner'
import {Animated} from "react-animated-css";
import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';





class ViewOffers extends Component {



  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      LinkedAccounts:[]
    };
  }
  
 getLinkedMerchants(){
  //api/merchants/search/findByBrandName?name=BrandName
  var auth = localStorage.getItem('auth');
  var BrandName = this.props.brandName;
 
  var that = this;
  var body = this.state.jsonBrandProfile;
  return  axios({
     method: 'get',
     url: API_ROOT+'api/merchants/search/findByBrandName?name='+ BrandName,
     data: body,
     headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

   })
   .then(function (response) {
   localStorage.setItem('auth', auth);
   
    that.setState({LinkedAccounts:response.data})
    
  
  
 })
 .catch(function (error) {
  
  
 }.bind(this)); 
 }

  componentDidMount()
  {
    this.getLinkedMerchants();
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  makecards(){
    if(this.state.LinkedAccounts.length !=0){
      var count =0;
      var cards = this.state.LinkedAccounts.map((i,index)=>{
        count++;
         return (
          <Col xs="6" md="6" className="mb-6" key={index}>
                
                <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>   
         <Card key='count' className='main-card-style linked-accounts-header'>
        <CardHeader className='cardhead-main linked-accounts-card-header'>
                {i.name}
            </CardHeader>
             
              
            <CardBody className="linked-accounts-cardbody">
            <Label className='boldhead' style={{color:'#0082C0'}}>Account Name</Label>
            <p>{i.name}</p>
            <Label className='boldhead' style={{color:'#0082C0'}}>Business Type</Label>
            <p>{i.businessType}</p>
            <Label className='boldhead' style={{color:'#0082C0'}}>Business Description</Label>
            <p>{i.description}</p>
            <Label className='boldhead' style={{color:'#0082C0'}}>Commercial Model</Label>
            <p>{i.commercialModel}</p>
            </CardBody>
          </Card></Animated></Col>)
      })
      return cards
    }else{
      return <div className='loader-class'><div className="align-self-center loader"><img src="img/loader.gif" /></div></div>
    }
  }
 



  render() {





    return (
        <div className="animated fadeIn">
          {/* <Col xs="12" sm="12" md="12"> */}
            <Card className='main-card-style'>
              <CardHeader className='cardhead-main card-header-bg-white'>
                   Linked Accounts
              </CardHeader>
              <CardBody>
                <p>A brand can be associated with more than one account.</p>
                <Row>
                  {this.makecards()}
                </Row>
              </CardBody>
            </Card>
          {/* </Col> */}
        </div>
    )
  }
}

export default ViewOffers;
