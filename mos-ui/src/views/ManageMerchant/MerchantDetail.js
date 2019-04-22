  import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import classnames from 'classnames';
import Popup from "reactjs-popup";
import {
  Row, Col, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardHeader, CardFooter, CardBody, Collapse, Form, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Alert,TabContent, TabPane, Nav, NavItem, NavLink, Badge } from 'reactstrap';



class MerchantDetail extends Component {


   constructor(props) {
    super(props);
    this.state = {
      businessType: '',
      businessDescription: '',
      commercialModel: '',
      contactPerson: '',
      businessTitle: '',
      businessPhonenumber: '',
      unitNo: '',
      floor: '',
      buildingName: '',
      streetNo: '',
      street: '',
      roadName1: '',
      roadName2: '',
      locality: '',
      city: '',
      country: '',
      postalCode: '',
      merchantId: '',
      emailId: '',
      popupopen: false
    };
    this.edit = this.edit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
   
  }



  componentDidMount()
  {
      this.setState({businessType: this.props.merchantDetail.businessType});
      this.setState({businessDescription: this.props.merchantDetail.description});
      this.setState({commercialModel: this.props.merchantDetail.commercialModel});
      this.setState({contactPerson: this.props.merchantDetail.contactPerson});
      this.setState({businessTitle: this.props.merchantDetail.businessType});
      this.setState({businessPhonenumber: this.props.merchantDetail.phoneNumber});
      this.setState({unitNo: this.props.merchantAddress.unitNo});
      this.setState({floor: this.props.merchantAddress.floor});
      this.setState({buildingName: this.props.merchantAddress.buildingName});
      this.setState({streetNo: this.props.merchantAddress.streetNo});
      this.setState({street: this.props.merchantAddress.street});
      this.setState({roadName1: this.props.merchantAddress.roadName1});
      this.setState({roadName2: this.props.merchantAddress.roadName2});
      this.setState({city: this.props.merchantAddress.cityName});
      this.setState({country: this.props.merchantAddress.country});
      this.setState({postalCode: this.props.merchantAddress.postalCode});
      this.setState({merchantId: this.props.merchantId});
      this.setState({emailId: this.props.merchantDetail.email});
  }

  edit()
  {
    const { history } = this.props;
    history.push('/createaccount/'+this.state.merchantId);
  }



  componentWillReceiveProps(nextProps)
  {
    if(this.props != nextProps)
    {
      this.setState({businessType: nextProps.merchantDetail.businessType});
      this.setState({businessDescription: nextProps.merchantDetail.description});
      this.setState({commercialModel: nextProps.merchantDetail.commercialModel});
      this.setState({contactPerson: nextProps.merchantDetail.contactPerson});
      this.setState({businessTitle: nextProps.merchantDetail.businessTitle});
      this.setState({businessPhonenumber: nextProps.merchantDetail.phoneNumber});
      this.setState({unitNo: nextProps.merchantAddress.unitNo});
      this.setState({floor: nextProps.merchantAddress.floor});
      this.setState({buildingName: nextProps.merchantAddress.buildingName});
      this.setState({streetNo: nextProps.merchantAddress.streetNo});
      this.setState({street: nextProps.merchantAddress.street});
      this.setState({roadName1: nextProps.merchantAddress.roadName1});
      this.setState({roadName2: nextProps.merchantAddress.roadName2});
      this.setState({city: nextProps.merchantAddress.cityName});
      this.setState({country: nextProps.merchantAddress.country});
      this.setState({postalCode: nextProps.merchantAddress.postalCode});
      this.setState({merchantId: nextProps.merchantId});
      this.setState({emailId: nextProps.merchantDetail.email});


    }
  }

  popupDeleteBrand(){
    // this is for the modal popup 

    
  }

closeBrand(){
    ///api/offers/closeBrandByName?brandName
   
    var auth = localStorage.getItem('auth');
   
     var that = this;
    
     var body = {};
     return  axios({
        method: 'get',
        url: API_ROOT+'api/merchants/closeMerchant?merchantId='+that.props.match.params.merchantid,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
 
      })
      .then(function (response) {
    
       if(response.status == 200){
        const { history } = that.props;
        history.push('/findaccount/accountdelete');
         //close()
       }
    
     
     
    })
    .catch(function (error) {
     
     
    }.bind(this)); 
}


closeModal(){
    this.setState({ popupopen: false });
  }

  openModal(){
    this.setState({ popupopen: true });
  }

  render() {

    return (
      <div className="animated fadeIn">
        {/* <Col xs="12" sm="12" md="12"> */}
            <Card>
              <CardHeader className='cardhead-main card-header-bg-white'>
                <i className="fa fa-pencil float-right pencil-top" onClick={this.edit}></i>
                <i className="fa fa-trash icons pencil-top float-right cursor-pointer" onClick={this.openModal} ></i>
                <Popup modal
                      closeOnDocumentClick
                      open={this.state.popupopen} 
                      onClose={this.closeModal}
                      lockScroll={false}>
                      <div style={{color:'#111'}} className="modal">
                      
                      <div className="header"> Close this Account?</div>
                        {/* <p>This will terminate this outlet</p> */}
                        <div className="content">
                        <p>You cannot undo this action. Delete it?</p>
                        </div>
                        <div className="actions">
                        <button
                          className="button close-button"
                          onClick={this.closeBrand.bind(this)}
                        >
                         Ok
                        </button>
                        <button
                          className="button cancel-button"
                          style={{marginLeft:'20px'}}
                          onClick={this.closeModal}
                        >
                         Cancel
                        </button>
                        </div>
                      </div>
                  </Popup>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Type</Label>
                    <p>{this.state.businessType}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Description</Label>
                    <p>{this.state.businessDescription}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Commercial Model </Label>
                    <p>{this.state.commercialModel}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Contact Person </Label>
                    <p>{this.state.contactPerson}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Title  </Label>
                    <p>{this.state.businessTitle}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Email </Label>
                    <p>{this.state.emailId}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Phone Number </Label>
                    <p>{this.state.businessPhonenumber}</p>
                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Address</Label>
                    <p>
                    {this.state.unitNo ? <span>{this.state.unitNo}, </span> : <span></span>}
                    {this.state.floor ? <span>{this.state.floor}, </span> : <span></span>}
                    {this.state.buildingName ? <span>{this.state.buildingName}, <br/></span> : <span></span>}
                    {this.state.streetNo ? <span>{this.state.streetNo}, </span> : <span></span>}
                    {this.state.street ? <span>{this.state.street}, <br/></span> : <span></span>}
                    {this.state.roadName1 ? <span>{this.state.roadName1}, </span> : <span></span>}
                    {this.state.roadName2 ? <span>{this.state.roadName2}, <br/></span> : <span></span>}
                    {this.state.locality ? <span>{this.state.locality}, </span> : <span></span>}
                    {this.state.city ? <span>{this.state.city}, <br/></span> : <span></span>}
                    {this.state.country ? <span>{this.state.country}</span> : <span></span>}
                    {this.state.postalCode ? <span> - {this.state.postalCode}</span> : <span></span>}

                    </p>
                  </Col>
                </Row>


              </CardBody>
            </Card>
        {/* </Col> */}
      </div>
          
    )
  }
}

export default MerchantDetail;
