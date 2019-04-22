import React, { Component } from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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

import ViewBrand from './viewBrand'

import ViewOutlets from './viewOutlets'
import ViewOffers from './viewOffers'
import LinkedAccounts from './viewLinkedAccounts'
import FindBrand from './FindBrand'
import ManageBrands from './ManageBrands'
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';



class BaseBrand extends Component {



  constructor() {
    super();
    this.handleCityCountryChange = this.handleCityCountryChange.bind(this);
    this.setBrand = this.setBrand.bind(this);
    this.changeBrand = this.changeBrand.bind(this)
    this.state = {
        activeStatus:{
            'true':'Active',
            'false':'Inactive'
        },
        activeState:true,
        activeTab:'1',
        jsonBrandProfile:{},
        totalBrandInfo:{},
        Outlets:[],
        OutletToProp:[],
        OfferToProp:[],
        page:'',
        optionCityCountry:[],
        optionBrand:[],
        selectedBrand:'',
        selectedCityCountry:''
    };
  }
  toggle(tab) {

      window.location.href = window.location.href.split('?')[0]

    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
 ActiveStatusHTML(){
    if(this.state.activeState){
        return <span style={{color:'green'}}> Active</span>
    }else{
        return <span style={{color:'red'}}> Inactive</span>
    }
}
 getOffers(){
  var auth = localStorage.getItem('auth');

  var that = this;
  //var brandId = window.location.href.split('#brandId=')[1];
  var body = {};
  return  axios({
     method: 'get',
     url: API_ROOT+'/api/offers/summaryByBrandName?name='+ window.location.href.split('#brandName=')[1],
     data: body,
     headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

   })
   .then(function (response) {
   localStorage.setItem('auth', auth);
 
   var offers = [];
   for(var a = 0;a<response.data.length;a++){
     //if(window.location.href.split('#brandId=')[1] == response.data[a].brand.brandId){
       offers.push(response.data[a])
     //}
   }
  that.setState({OfferToProp:offers})
    
  
  
 })
 .catch(function (error) {
  
 
 }.bind(this)); 
 }
getCityCountry(){
 // /api/brands/cityCountry
///api/brands/search/findBrand/{name}
var auth = localStorage.getItem('auth');
loadProgressBar();
var that = this;

var body = {};
return  axios({
   method: 'get',
   url: API_ROOT+'api/brands/cityCountry',
   data: body,
   headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

 })
 .then(function (response) {
 localStorage.setItem('auth', auth);

 var o = [];
 for(var a=0;a<response.data.length;a++){
    var t = {
      value:response.data[a],
      label:response.data[a]
    }
    o.push(t)
 }
 setTimeout(()=>{
  that.setState({optionCityCountry:o})
 },0)
  
})
.catch(function (error) {

}.bind(this)); 

}
changeBrand(){
  window.location.href = window.location.href.split('=')[0] +'=' +this.state.selectedBrand.label;
  location.reload();
  
}
setBrand(selectedBrand){
  this.setState({selectedBrand:selectedBrand})
}
handleCityCountryChange(selectedCountryCity){
  ///api/brands/search/findBrand/{name}
  var that = this;
  // self.setState({ selectedCity });
  // self.setState({ City: selectedCity.value });
this.setState({selectedCityCountry:selectedCountryCity})
   var auth = localStorage.getItem('auth');
    var body = {};
    var that = this;
  axios({
            method: 'get',
            url: API_ROOT+'api/brands/search/findBrand/'+selectedCountryCity.value,
            data: body,
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

            })
            .then(function (response) {
          
                var o = [];
                for(var a=0;a<response.data.results.length;a++){
                   var t = {
                     value:response.data.results[a].id,
                     label:response.data.results[a].name
                   }
                 

                    o.push(t)
                }
                setTimeout(()=>{
                  that.setState({optionBrand:o})
                },101)

         
          })
          .catch(function (error) {
          
          }.bind(this));
}
  componentDidMount()
  {
    this.makePage();
    this.getCityCountry();
    this.getOutlets();
    this.getOffers();
    //this.fetchListOfOutlets();
    const { history } = this.props;

   
    if(window.location.href.split('#brandName=')[1] == undefined){
      history.push('/FindBrand');
    }

    
  }
  iftabsorfind(){
   
   
     
      return
      (<div>
        
   </div>)
    
  }
  makeTabChange(){
  
  }
  makePage(){
   
    
    var uname='';
    var pwd='';
    var body = {
      
      };

    var auth = localStorage.getItem('auth');
    var brandName = window.location.href.split('#brandName=')[1];
   
    var that = this;
    if(brandName){

    
    return  axios({
        method: 'get',
        url: API_ROOT+'api/brands/search?brandName='+brandName,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
     
        that.setState({jsonBrandProfile:response.data.brand})
        that.setState({totalBrandInfo:response.data})
          if(response.data.status == 'active'){
           
            that.setState({activeState:true})
          }else{
            that.setState({activeState:false})
          }
     
       
      })
      .catch(function (error) {
       
        
      }.bind(this));}

  }
  getOutlets(){
    var auth = localStorage.getItem('auth');
  
    var that = this;
    var brandName= window.location.href.split('#brandName=')[1];
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/outlets/summaryByBrandName?name='+ brandName,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
   
    that.setState({OutletToProp:response.data})
       
    
    
   })
   .catch(function (error) {
    
   
   }.bind(this)); 
  }
  // fetchListOfOutlets(){
  //   //api/outlets/search/findByBrandId/3

  //   var body = {
      
  //     };
  //   var that = this;
  //   var auth = localStorage.getItem('auth');
  //   var brandId = window.location.href.split('#brandId=')[1];

  //   var that = this;
  //   if(brandId){
  //   return  axios({
  //       method: 'get',
  //       url: API_ROOT+'api/outlets/search/findByBrandId/'+brandId,
  //       data: body,
  //       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

  //       })
  //       .then(function (response) {

  //      var outlets = response.data.results;
  //      that.setState({Outlets:outlets})

  //     })
  //     .catch(function (error) {
       

  //     }.bind(this));
  // }}
 iftabone(){
    //  if(this.state.activeTab == '1'){
    //      return <ViewBrand/>
    //  }else{
    //      return ''
    //  }
     switch(this.state.activeTab){

         case '1': return (
         <div>
         <ViewBrand jsonBrandProfile={this.state.jsonBrandProfile} totalBrandInfo={this.state.totalBrandInfo}/>
                          </div>)
         break;
         case '2': return <ViewOutlets Outlets={this.state.OutletToProp}/>
         break;
         case '3': return <ViewOffers Outlets={this.state.Outlets} Offers={this.state.OfferToProp}/>
         break;
         case '4': return <LinkedAccounts brandName={this.state.jsonBrandProfile.name}/>
         break;
         default: return ''
     }
 }



  render() {

const {selectedCityCountry, selectedBrand} = this.state;



    return (
        <div className="animated fadeIn">
             {/* <Animated animationIn="bounceInDown" animationOut="fadeOut" isVisible={true}> */}
                  <Row className="find-top">
                       <Col md="2">
                        &nbsp;
                       </Col>
                      <Col md="4" className="align-middle">
                      <FormGroup>
                      
                      <Select
                        name="form-field-name"
                        placeholder="Select Country/city..."
                        value={selectedCityCountry}
                        onChange={this.handleCityCountryChange}
                        options={this.state.optionCityCountry}
                        // className={this.state.isDisabledCountry ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>


                  


                    <Col md="4">
                      <FormGroup>
                      <Select
                        name="form-field-name"
                        value={selectedBrand}
                        placeholder="Select Brand..."
                         onChange={this.setBrand}
                         options={this.state.optionBrand}
                        // className={this.state.isDisabledMerchant ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>

                    <Col md="2" className="align-middle">

                      <button className="btn btn-primary" onClick={this.changeBrand}>Go</button>

                    </Col>




                  </Row>
                  {/* </Animated> */}
              <Row>
       <Col xs="12" sm="6" md="6">
            <h3 style={{textTransform:'uppercase',height:'29px'}}>{this.state.jsonBrandProfile.name}</h3>
       </Col>
       
   </Row>
   <Row>
   <Col xs="12" md="12" className="mb-12">
   <Nav tabs className='tab-class tab-class-font-weight' >
     <NavItem>
       <NavLink
         className={classnames({ active: this.state.activeTab === '1' })}
         onClick={() => { this.toggle('1'); }}
       >
         Brand Profile
       </NavLink>
     </NavItem>
     <NavItem>
       <NavLink
         className={classnames({ active: this.state.activeTab === '2' })}
         onClick={() => { this.toggle('2'); }}
       >
         Outlets
       </NavLink>
     </NavItem>
     <NavItem>
       <NavLink
         className={classnames({ active: this.state.activeTab === '3' })}
         onClick={() => { this.toggle('3'); }}
       >
         Offers
       </NavLink>
     </NavItem>
     <NavItem>
       <NavLink
         className={classnames({ active: this.state.activeTab === '4' })}
         onClick={() => { this.toggle('4'); }}
       >
         Linked Accounts
       </NavLink>
     </NavItem>
   </Nav>
   </Col>
   {/* <Row> */}
   <Col >
   <TabContent activeTab={this.state.activeTab} >
 <TabPane tabId="1" >
 {this.iftabone()}
 </TabPane>
 <TabPane tabId="2">
 {this.iftabone()}
 </TabPane>
 <TabPane tabId="3">
 {this.iftabone()}
 </TabPane>
 <TabPane tabId="4">
 {this.iftabone()}
 </TabPane>
 </TabContent>
   </Col>
   {/* </Row> */}
   </Row>
        </div>
    )
  }
}

export default BaseBrand;
