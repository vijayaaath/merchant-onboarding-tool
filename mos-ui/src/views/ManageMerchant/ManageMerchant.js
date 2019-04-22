import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import classnames from 'classnames';
import {
  Row, Col, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardHeader, CardFooter, CardBody, Collapse, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Alert,TabContent, TabPane, Nav, NavItem, NavLink, Badge } from 'reactstrap';
import MerchantDetail from './MerchantDetail'
import Brand from './Brand'
import OutletBase from './OutletBase'
import OfferBase from './OfferBase'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ManageMerchant extends Component {


	 constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleCityCountryChange = this.handleCityCountryChange.bind(this);
    this.setBrand = this.setBrand.bind(this);
    this.changeBrand = this.changeBrand.bind(this);
    this.state = {
      activeTab: this.props.match.params.tabshow,
      merchantId: this.props.match.params.merchantid,
      merchantDetail: [],
      merchantName: '',
      merchantAddress: [],
      shownotification: false,
      selectedCityCountry:'',
      selectedBrand: ''
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }


	componentDidMount()
	{
      this.loadMerchantDetails();
      this.getCityCountry();
      if(this.props.match.params.msg)
      {
        window.scrollTo(0, 0);
        this.setState({shownotification:true});
        setTimeout(function() { this.setState({shownotification:false}) }.bind(this), 10000);
      }
      
	}
  componentWillMount()
  {
    
  }



componentWillReceiveProps(nextProps)
{
  if(nextProps)
  {
    this.setState({activeTab: nextProps.match.params.tabshow});
  
    if(nextProps.match.params.msg == 'brandupdated')
    {
      window.scrollTo(0, 0);
      toast.success("Brand Updated successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'outletcreated')
    {
      window.scrollTo(0, 0);
      toast.success("Outlet Created successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'brandadded')
    {
      window.scrollTo(0, 0);
      toast.success("Brand added successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'offercreated')
    {
      window.scrollTo(0, 0);
      toast.success("Offer Created successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'offerdeleted')
    {
      window.scrollTo(0, 0);
      toast.success("Offer Deleted successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'offerupdated')
    {
      window.scrollTo(0, 0);
      toast.success("Offer Updated successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'branddelted')
    {
      window.scrollTo(0, 0);
      toast.success("Brand deleted successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'outletdeleted')
    {
      window.scrollTo(0, 0);
      toast.success("Outlet deleted successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }

    if(nextProps.match.params.msg == 'outletupdated')
    {
      window.scrollTo(0, 0);
      toast.success("Outlet updated successfully !", {
        position: toast.POSITION.TOP_CENTER
      });
  
    }
    

    if(nextProps.match.params.msg == 'createoutlet' || nextProps.match.params.msg == 'createoffer' || nextProps.match.params.msg == 'createbrand')
    {
      window.scrollTo(0, 0);
      this.setState({shownotification:true});  
      setTimeout(function() { this.setState({shownotification:false}) }.bind(this), 10000);    
    }

    if(nextProps.match.params.msg)
      {        
        window.scrollTo(0, 0);
        this.setState({shownotification:true});       
      }
  }
}


  getCityCountry(){
 // /api/brands/cityCountry
///api/brands/search/findBrand/{name}
var auth = localStorage.getItem('auth');

var that = this;

var body = {};
var userId = localStorage.getItem('userId');
return  axios({
   method: 'get',
   url: API_ROOT+'api/merchants/cityCountryByUser?userId='+userId,
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
    var userId = localStorage.getItem('userId');
  axios({
            method: 'get',
            url: API_ROOT+'api/merchants/search/findMerchantByUser/'+selectedCountryCity.value+'?userId='+userId,
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

changeBrand(){
window.location.href = '#/managemerchant/'+this.state.selectedBrand.value+'/1';
location.reload();
  
}





  loadMerchantDetails()
  {
    
    var self = this;
    var auth = localStorage.getItem('auth');
    loadProgressBar();
    var body = {};
    axios({
        method: 'get',
        url: API_ROOT+'api/merchants/'+this.state.merchantId,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
          self.setState({merchantName: response.data.name});
          self.setState({merchantDetail: response.data});
          self.setState({merchantAddress: response.data.address});
      })
      .catch(function (error) {
      
      }.bind(this));
  }

  tabpaneShow()
  {
    if(this.state.activeTab == 1)
    {
      return <MerchantDetail merchantDetail={this.state.merchantDetail} merchantAddress={this.state.merchantAddress} merchantName={this.state.merchantName} merchantId={this.state.merchantId} {...this.props}/>;
    }
    if(this.state.activeTab == 2)
    {
      return <Brand msg={this.props.match.params.msg} {...this.props}/>;
    }
    if(this.state.activeTab == 3)
    {
      return <OutletBase  msg={this.props.match.params.msg} {...this.props}/>;
    }
    if(this.state.activeTab == 4)
    {
      return <OfferBase msg={this.props.match.params.msg} {...this.props}></OfferBase>;
    }
  }




  render() {
    const {selectedCityCountry, selectedBrand} = this.state;
    return (
      <div className="animated fadeIn">
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
                        placeholder="Select Merchant..."
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
        <Row>
          <Col xs="12" sm="6" md="6">
            <h3>{this.state.merchantName}</h3>
          </Col>
        </Row>

        {this.state.shownotification && this.props.match.params.msg == 'update' ? <div className="alert alert-success fade show" role="alert">{this.state.merchantName} updated successfully!</div> : <span></span> }

        {this.state.shownotification && this.props.match.params.msg == 'createbrand' ? <div className="alert alert-success fade show" role="alert">Account created successfully, Proceed to add brands.</div> : <span></span> }

        {this.state.shownotification && this.props.match.params.msg == 'createoutlet' ? <div className="alert alert-success fade show" role="alert">Brand created successfully, Proceed to add Outlets.</div> : <span></span> }

         {this.state.shownotification && this.props.match.params.msg == 'createoffer' ? <div className="alert alert-success fade show" role="alert">Offer created successfully.</div> : <span></span> }
         <ToastContainer autoClose={10000} />
        <Row>
          <Col xs="12" md="12" className="mb-12">
             <Nav tabs className='tab-class tab-class-font-weight' >
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Account profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Brands
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                  Outlets
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4' })}
                  onClick={() => { this.toggle('4'); }}
                >
                  Offers
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                {this.state.activeTab == '1' ? <span>{this.tabpaneShow()}</span> : <span></span> }
              </TabPane>
              <TabPane tabId="2">
                {this.state.activeTab == '2' ? <span>{this.tabpaneShow()}</span> : <span></span> }               
              </TabPane>
              <TabPane tabId="3">
                {this.state.activeTab == '3' ? <span>{this.tabpaneShow()}</span> : <span></span> }               
              </TabPane>
              <TabPane tabId="4">
                {this.state.activeTab == '4' ? <span>{this.tabpaneShow()}</span> : <span></span> }
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
	      	
    )
  }
}

export default ManageMerchant;
