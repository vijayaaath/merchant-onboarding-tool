import React, { Component } from 'react';
import classnames from 'classnames';
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



class AccountBase extends Component {



  constructor(props) {
    super(props);
    this.state = {
        activeStatus:{
            'true':'Active',
            'false':'Inactive'
        },
        accountName: '',
        businessType: '',
        businessDesciption: '',
        commercialModel: '',
        address: '',
        businessTitle: '',
        businessPhonenumber: '',
        activeState:true,
        activeTab:'1',
        merchantAddress: '',
        munitNo: '',
        mstreetNo: '',
        mstreet: '',
        mbuilding: '',
        mcity: '',
        mstate: '',
        mcountry: '',
        mpostalcode: '',
        merchantId: ''
    };
    this.getMerchantDetail = this.getMerchantDetail.bind(this);
  }


  componentDidMount()
  {
    this.getMerchantDetail();
  }

  getMerchantDetail(){
    var self = this;
    var auth = localStorage.getItem('auth');
    var body = {};
    var merchantId = this.props.match.params.merchantid;

    self.setState({merchantId: merchantId});

    axios({
        method: 'get',
        url: API_ROOT+'api/merchants/'+merchantId,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
          self.setState({accountName: response.data.name});
          self.setState({businessType: response.data.businessType});
          self.setState({businessDesciption: response.data.description});
          self.setState({commercialModel: response.data.commercialModel});
          self.setState({businessTitle: response.data.businessTitle});
          self.setState({businessPhonenumber: response.data.phoneNumber});
          self.setState({contactPerson: response.data.contactPerson});
          self.setState({munitNo: response.data.address.unitNo});
          self.setState({mstreetNo: response.data.address.streetNo});
          self.setState({mstreet: response.data.address.street});
          self.setState({mbuilding: response.data.address.building});
          self.setState({mcity: response.data.address.city});
          self.setState({mstate: response.data.address.state});
          self.setState({mcountry: response.data.address.country});
          self.setState({mpostalcode: response.data.address.postalCode});
          var merchantAddress1 = response.data.address.unitNo+", "+response.data.address.streetNo+", "+response.data.address.street+", "+response.data.address.building+", "+response.data.address.city+", "+response.data.address.state+", "+response.data.address.country+" - "+response.data.address.postalCode;
          self.setState({merchantAddress: merchantAddress1});
      })
      .catch(function (error) {
     
      }.bind(this));
  }


  toggle(tab) {
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
 

 iftabone(){
     switch(this.state.activeTab){

         case '1': return <MerchantDetail 
         businessType={this.state.businessType} 
         businessDesciption={this.state.businessDesciption}
         munitNo={this.state.munitNo} 
         mstreetNo={this.state.mstreetNo}
         mstreet={this.state.mstreet}
         mbuilding={this.state.mbuilding}
         mcity={this.state.mcity}
         mstate={this.state.mstate}
         mcountry={this.state.mcountry}
         mpostalcode={this.state.mpostalcode}
         commercialModel={this.state.commercialModel}
         contactPerson={this.state.contactPerson}
         businessTitle={this.state.businessTitle}
         businessPhonenumber={this.state.businessPhonenumber}
         address={this.state.merchantAddress}/>
         break;
         case '2': return <ViewBrand
         merchantId={this.state.merchantId} {...this.props}/>
         break;
         default: return ''
     }
 }



  render() {

    return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" sm="6" md="6">
                    <h3>{this.state.accountName}</h3>
                </Col>
                
            </Row>
            <Row>
            <Col xs="12" md="12" className="mb-12">
            <Nav tabs className='nav-fill' style={{marginTop:20+'px'}}>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Account Profile
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

export default AccountBase;