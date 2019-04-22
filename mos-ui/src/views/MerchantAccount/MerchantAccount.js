import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
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
import Select from 'react-select';
import 'react-select/dist/react-select.css';



function saveMerchantValidate(accountName, btype, contactPerson, businessTitle, phoneNumber, unitNo, floor,buildingName, streetNo, street, roadname1, locality, city, postalCode) {
  // true means invalid, so our conditions got reversed
  return {
    accountName: accountName.length === 0,    
    btype: btype.length === 0,  
    contactPerson: contactPerson.length === 0,
    businessTitle: businessTitle.length === 0,
    phoneNumber: phoneNumber.length === 0,
    // unitNo: unitNo.length === 0,
    // floor: floor.length === 0,
    // buildingName: buildingName.length === 0,
    streetNo: streetNo.length === 0,
    street: street.length === 0,
    roadname1: roadname1.length === 0,
    locality: locality.length === 0,
    city: city.length === 0,
    postalCode: postalCode.length === 0
  };
}



function saveMerchantValidate3(accountName, btype, contactPerson, businessTitle, phoneNumber, country) {
  // true means invalid, so our conditions got reversed
  return {
    accountName: accountName.length === 0,
    btype: btype.length === 0,    
    contactPerson: contactPerson.length === 0,
    businessTitle: businessTitle.length === 0,
    phoneNumber: phoneNumber.length === 0,
    country: country.length === 0
  };
}





function saveMerchantValidate2(accountName, btype, contactPerson, businessTitle, phoneNumber, unitNo, buildingName, streetNo, street, postalCode) {
  // true means invalid, so our conditions got reversed
  return {
    accountName: accountName.length === 0,
    btype: btype.length === 0,
    contactPerson: contactPerson.length === 0,
    businessTitle: businessTitle.length === 0,
    phoneNumber: phoneNumber.length === 0,
    unitNo: unitNo.length === 0,
    buildingName: buildingName.length === 0,
    streetNo: streetNo.length === 0,
    street: street.length === 0,
    postalCode: postalCode.length === 0
  };
}


class MerchantAccount extends Component {


   constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
      selectedOptionType: '',
      selectedOptionCity: '',
      accountName: '',
      businessType: '',
      businessDescription:'',
      commercialModel: '',
      unitNo: '',
      streetNo: '',
      street: '',
      building: '',
      state: '',
      postalCode: '',
      contactPerson: '',
      businessTitle: '',
      phoneNumber: '',
      emailId: '',
      country: '',
      floor: '',
      isDisabledAccountName: false,
      isDisabledBusinessType: false,
      isDisabledBusinessDescription: false,
      isDisabledCommercialModel: false,
      isDisabledUnitNo: false,
      isDisabledStreetNo: false,
      isDisabledStreet: false,
      isDisabledCountry: false,
      isDisabledCity: false,
      isDisabledFloor: false,
      isDisabledBuilding: false,
      isDisabledState: false,
      isDisabledPostalCode: false,
      isDisabledContactPerson: false,
      isDisabledBusinessTitle: false,
      isDisabledPhoneNumber: false,
      isDisabledLocality: false,
      isDisabledEmailId: false,
      isDisabledRoadName1: false,
      countryAddress1: true,
      countryAddress2: true,
      roadName1: '',
      roadName2: '',
      locality: '',
      countryDropDown: [],
      enablesave: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleBusinessTypeChange = this.handleBusinessTypeChange.bind(this);
    this.handleMerchantSubmit = this.handleMerchantSubmit.bind(this);
    this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
    this.handleBusinessDescriptionChange = this.handleBusinessDescriptionChange.bind(this);
    this.handleCommercialModelChange = this.handleCommercialModelChange.bind(this);
    this.handleUnitNoChange = this.handleUnitNoChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleStreetNoChange = this.handleStreetNoChange.bind(this);
    this.handleStreetChange = this.handleStreetChange.bind(this);
    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePostalCodeChange = this.handlePostalCodeChange.bind(this);
    this.handleContactPersonChange = this.handleContactPersonChange.bind(this);
    this.handleBusinessTitleChange = this.handleBusinessTitleChange.bind(this);
    this.handleBusinessTitleChange1 = this.handleBusinessTitleChange1.bind(this);
    this.handleBusinessPhoneNumberChange = this.handleBusinessPhoneNumberChange.bind(this);
    this.handleBusinessEmailIdChange = this.handleBusinessEmailIdChange.bind(this);
    this.handleRoadName1Change = this.handleRoadName1Change.bind(this);
    this.handleRoadName2Change = this.handleRoadName2Change.bind(this);
    this.handlelocalityChange = this.handlelocalityChange.bind(this);
    this.back = this.back.bind(this);

  }


  componentDidMount()
  {
    this.loadcountries();
    this.loadmerchant();
  }

  loadcountries()
  {

      var self = this;
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
              method: 'get',
              url: API_ROOT+'api/merchants/search/country/all',
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {
                   response.data.country.map((obj, key)=> {
                  self.setState({countryDropDown: [...self.state.countryDropDown, {value: obj,label: obj}]});
            });
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));

  }

  loadmerchant()
  {
    if(this.props.match.params.merchantid)
    {
      var self = this;
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
          method: 'get',
          url: API_ROOT+'api/merchants/'+this.props.match.params.merchantid,
          data: body,
          headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

          })
          .then(function (response) {
         
            self.setState({accountName:response.data.name});
            self.setState({businessType:response.data.businessType});
            self.setState({businessDescription:response.data.description});
            self.setState({commercialModel:response.data.commercialModel});
            self.setState({contactPerson:response.data.contactPerson});
            self.setState({businessTitle:response.data.businessTitle});
            self.setState({phoneNumber:response.data.phoneNumber});
            self.setState({emailId:response.data.email});
            var bType = {"label":response.data.businessType,"value":response.data.businessType};
            self.setState({selectedOptionType:response.data.businessType});
            var coun = {"label":response.data.address.country,"value":response.data.address.country};
            self.setState({selectedOption:coun});
            if(response.data.address.country == 'India')
            {
              self.setState({unitNo:response.data.address.unitNo});
              self.setState({floor:response.data.address.floor});
              self.setState({building:response.data.address.buildingName});
              self.setState({streetNo:response.data.address.streetNo});
              self.setState({street:response.data.address.streetName});
              self.setState({roadName1:response.data.address.roadName1});
              self.setState({roadName2:response.data.address.roadName2});
              self.setState({locality:response.data.address.locality});
              self.setState({selectedOptionCity:response.data.address.cityName});
              self.setState({country:response.data.address.country});
              self.setState({postalCode:response.data.address.postalCode});
              self.setState({countryAddress1: false});
              self.setState({countryAddress2: true});
            }


            if(response.data.address.country == 'Singapore')
            {
              self.setState({unitNo:response.data.address.unitNo});
              self.setState({floor:response.data.address.floor});
              self.setState({building:response.data.address.buildingName});
              self.setState({streetNo:response.data.address.streetNo});
              self.setState({street:response.data.address.streetName});
              self.setState({roadName1:response.data.address.roadName1});
              self.setState({roadName2:response.data.address.roadName2});
              self.setState({locality:response.data.address.locality});
              self.setState({city:response.data.address.cityName});
              self.setState({country:response.data.address.country});
              self.setState({postalCode:response.data.address.postalCode});
              self.setState({countryAddress1: true});
              self.setState({countryAddress2: false});
            }

        })
        .catch(function (error) {
        
        }.bind(this));

        
    }
  }

  back()
  {
    const { history } = this.props;
    history.push('/managemerchant/'+this.props.match.params.merchantid+'/1');
  }



  handleAccountNameChange(event) {
    this.setState({accountName: event.target.value});
    this.setState({isDisabledAccountName: false});
  }
  handleBusinessDescriptionChange(event) {
    this.setState({businessDescription: event.target.value});
    this.setState({isDisabledBusinessDescription: false});
  }
  handleCommercialModelChange(event) {
    this.setState({commercialModel: event.target.value});
    this.setState({isDisabledCommercialModel: false});
  }
  handleUnitNoChange(event) {
    this.setState({unitNo: event.target.value});
    this.setState({isDisabledUnitNo: false});
  }

  handleFloorChange(event) {
    this.setState({floor: event.target.value});
    this.setState({isDisabledFloor: false});
  }
  handleRoadName1Change(event) {
    this.setState({roadName1: event.target.value});
    this.state({isDisabledRoadName1: false});
  }
  handleRoadName2Change(event) {
    this.setState({roadName2: event.target.value});
  }
  handlelocalityChange(event) {
    this.setState({locality: event.target.value});
    this.setState({isDisabledLocality: false});
  }
  handleStreetNoChange(event) {
    this.setState({streetNo: event.target.value});
    this.setState({isDisabledStreetNo: false});
  }
  handleStreetChange(event) {
    this.setState({street: event.target.value});
    this.setState({isDisabledStreet: false});
  }
  handleBuildingChange(event) {
    this.setState({building: event.target.value});
    this.setState({isDisabledBuilding: false});
  }
  handleStateChange(event) {
    this.setState({state: event.target.value});
    this.setState({isDisabledState: false});
  }
  handlePostalCodeChange(event) {
    this.setState({postalCode: event.target.value});
    this.setState({isDisabledPostalCode: false});
  }
  handleContactPersonChange(event) {
    this.setState({contactPerson: event.target.value});
    this.setState({isDisabledContactPerson: false});
  }
  handleBusinessTitleChange1(event) {
    this.setState({businessTitle: event.target.value});
    //this.setState({isDisabledBusinessTitle: false});
  }
  handleBusinessTitleChange(event) {
    this.setState({emailId: event.target.value});
    this.setState({isDisabledBusinessTitle: false});
  }
  handleBusinessPhoneNumberChange(event) {
    this.setState({phoneNumber: event.target.value});
    this.setState({isDisabledPhoneNumber: false});
  }
  handleBusinessEmailIdChange(event) {
    this.setState({emailId: event.target.value});
    this.setState({isDisabledEmailId: false});
  }

 handleChange (selectedOption) {
    //this.setState({ selectedOption: event.target.value });
    this.setState({ selectedOption });

    if(selectedOption!=null)
    {      
      if(selectedOption.value == 'India')
      {
        this.setState({countryAddress1: false});
        this.setState({countryAddress2: true});
      }

      if(selectedOption.value == 'Singapore')
      {
        this.setState({countryAddress2: false});
        this.setState({countryAddress1: true});
      }
      this.setState({country: selectedOption.value});
      this.setState({isDisabledCountry: false});
    }
    else
    {      
      this.setState({isDisabledCountry: true});
    }


    
  }
  handleBusinessTypeChange (event) {    
    console.log(event.target.value);
    this.setState({ selectedOptionType : event.target.value });

    if(event.target.value!=null)
    {      
      this.setState({isDisabledBusinessType: false});
    }
    else
    {      
      this.setState({isDisabledBusinessType: true});
    }
  }
  handleChangeCity (event) {
    this.setState({ selectedOptionCity: event.target.value });
    this.setState({isDisabledCity: false});
  }


  handleMerchantSubmit(evt){

    if (!this.merchantCanBeSubmitted()) {
          evt.preventDefault();
          return;
      }

       var auth = localStorage.getItem('auth');
       var tenantName = localStorage.getItem('tenantName');
       var self = this;

        self.setState({enablesave: false});

        var body = {
              "name":self.state.accountName,
             "businessType" : self.state.selectedOptionType,
             "description" : self.state.businessDescription,
             "commercialModel" : self.state.commercialModel,
             "address" : {
               "unitNo": self.state.unitNo,
               "floor": self.state.floor,
               "buildingName": self.state.building,
               "streetNo": self.state.streetNo,
               "streetName": self.state.street,
               "roadName1": self.state.roadName1,
               "roadName2": self.state.roadName2,
               "locality": self.state.locality,
               "cityName": self.state.selectedOptionCity,
               "postalCode": self.state.postalCode,
               "country": self.state.selectedOption.value

             },
             "contactPerson" : self.state.contactPerson,
             "phoneNumber" : self.state.phoneNumber,
             "email" : self.state.emailId,
             "businessTitle" : self.state.businessTitle,
             "tenantName" : tenantName,
             "status" : "active"
          };

          if(this.props.match.params.merchantid)
          {
              axios({
                method: 'post',
                url: API_ROOT+'api/merchants/'+this.props.match.params.merchantid,
                data: body,
                headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                })
                .then(function (response) {
                 
                    var mID = response.data;
                    const { history } = self.props;
                    history.push('/managemerchant/'+mID+'/1/update');

              })
              .catch(function (error) {
                 //self.setState({roles:[]});
              }.bind(this)); 
          }
          else
          {
              axios({
                method: 'post',
                url: API_ROOT+'api/merchants',
                data: body,
                headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                })
                .then(function (response) {
                 
                    var mID = response.data;
                    self.setState({enablesave: true});
                    const { history } = self.props;
                    history.push('/managemerchant/'+mID+'/2/createbrand');


              })
              .catch(function (error) {
                 //self.setState({roles:[]});
              }.bind(this)); 
          }
                  

  }

  merchantCanBeSubmitted() {

    if(this.state.selectedOptionType == undefined || this.state.selectedOptionType == '')
    {
      var bType = '';
    }
    else
    {
      var bType = this.state.selectedOptionType;
    }
    
    if(this.state.selectedOption.value == 'India')
    {
        const errors = saveMerchantValidate(this.state.accountName,bType,this.state.contactPerson,this.state.emailId,this.state.phoneNumber,this.state.unitNo,this.state.floor,this.state.building,this.state.streetNo,this.state.street,this.state.roadName1,this.state.locality,this.state.selectedOptionCity,this.state.postalCode);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({isDisabledAccountName: errors.accountName});
        this.setState({isDisabledBusinessType: errors.btype});        
        this.setState({isDisabledContactPerson: errors.contactPerson});
        this.setState({isDisabledBusinessTitle: errors.businessTitle});
        this.setState({isDisabledPhoneNumber: errors.phoneNumber});
        this.setState({isDisabledUnitNo: errors.unitNo});
        this.setState({isDisabledFloor: errors.floor});
        this.setState({isDisabledBuilding: errors.buildingName});
        this.setState({isDisabledStreetNo: errors.streetNo});
        this.setState({isDisabledStreet: errors.street});
        this.setState({isDisabledRoadName1: errors.roadname1});
        this.setState({isDisabledLocality: errors.locality});
        this.setState({isDisabledCity: errors.city});
        this.setState({isDisabledPostalCode: errors.postalCode});      
        return !isDisabled;
    }



    if(this.state.selectedOption.value == 'Singapore')
    {

        if(this.state.selectedOptionType == undefined || this.state.selectedOptionType == '')
        {
          var bType = '';
        }
        else
        {
          var bType = this.state.selectedOptionType;
        }
        const errors = saveMerchantValidate2(this.state.accountName,bType,this.state.contactPerson,this.state.emailId,this.state.phoneNumber,this.state.unitNo,this.state.building,this.state.streetNo,this.state.street,this.state.postalCode);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({isDisabledAccountName: errors.accountName});
        this.setState({isDisabledBusinessType: errors.btype});                
        this.setState({isDisabledContactPerson: errors.contactPerson});
        this.setState({isDisabledBusinessTitle: errors.businessTitle});
        this.setState({isDisabledPhoneNumber: errors.phoneNumber});
        this.setState({isDisabledUnitNo: errors.unitNo});    
        this.setState({isDisabledBuilding: errors.buildingName});
        this.setState({isDisabledStreetNo: errors.streetNo});
        this.setState({isDisabledStreet: errors.street});        
        this.setState({isDisabledPostalCode: errors.postalCode});
        return !isDisabled;
    }
    


    if(this.state.selectedOption.value == undefined)
    {



      if(this.state.selectedOptionType == undefined || this.state.selectedOptionType == '')
        {
          var bType = '';
        }
        else
        {
          var bType = this.state.selectedOptionType;
        }

      const errors = saveMerchantValidate3(this.state.accountName,bType,this.state.contactPerson,this.state.emailId,this.state.phoneNumber,this.state.country);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({isDisabledAccountName: errors.accountName});
        this.setState({isDisabledBusinessType: errors.btype});        
        this.setState({isDisabledContactPerson: errors.contactPerson});
        this.setState({isDisabledBusinessTitle: errors.businessTitle});
        this.setState({isDisabledPhoneNumber: errors.phoneNumber});
        this.setState({isDisabledCountry: errors.country});
        return !isDisabled;
    }

    
  }


  



  render() {
     const { selectedOption,selectedOptionCity,selectedOptionType } = this.state;
    const value = selectedOption && selectedOption.value;
    const valueCity = selectedOptionCity && selectedOptionCity.value;
    //const valueBusinessType = selectedOptionType && selectedOptionType.value;
    return (
      <div className="animated fadeIn">
          <Col xs="12" md="12">
            <h3>{this.props.match.params.merchantid ? <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={this.back}></i></span> : <span></span>}<span>{this.props.match.params.merchantid ? <span>Edit Merchant Account</span> : <span>Create Account</span> }</span></h3>
            <Card className="card-border">
              <CardBody className="card-padding-top">
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Account Name <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" className={this.state.isDisabledAccountName ? "error" : ""} id="text-input" name="text-input" placeholder="Type your account name" onChange={this.handleAccountNameChange} value={this.state.accountName}/>
                    </Col>
                  </FormGroup>
                     <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Type <span className="required">*</span></Label>
                    </Col>
                    <Col md="9">
                    <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Individual Merchant" onChange={this.handleBusinessTypeChange} checked={this.state.selectedOptionType === "Individual Merchant"}/>
                        <Label className="form-check-label" check htmlFor="inline-radio1">Individual Merchant</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="Offer Aggregator" onChange={this.handleBusinessTypeChange} checked={this.state.selectedOptionType === "Offer Aggregator"}/>
                        <Label className="form-check-label" check htmlFor="inline-radio2">Offer Aggregator</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="Property Management" onChange={this.handleBusinessTypeChange} checked={this.state.selectedOptionType === "Property Management"}/>
                        <Label className="form-check-label" check htmlFor="inline-radio3">Property Management</Label>
                      </FormGroup>
                     {this.state.isDisabledBusinessType ?  <small class="form-text text-red">This field is required.</small> : <small class="form-text text-red"></small> }                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" name="textarea-input" id="textarea-input" rows="4"
                             placeholder="Description here" className={this.state.isDisabledBusinessDescription ? "error" : ""} onChange={this.handleBusinessDescriptionChange} value={this.state.businessDescription}/>
                    </Col>
                  </FormGroup>
                   <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Commercial Model</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Type here" className={this.state.isDisabledCommercialModel ? "error" : ""} onChange={this.handleCommercialModelChange} value={this.state.commercialModel}/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Contact Person <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Person name" className={this.state.isDisabledContactPerson ? "error" : ""} onChange={this.handleContactPersonChange} value={this.state.contactPerson}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Title</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Title of your business" onChange={this.handleBusinessTitleChange1} value={this.state.businessTitle}/>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Email ID <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Email ID" className={this.state.isDisabledBusinessTitle ? "error" : ""} onChange={this.handleBusinessTitleChange} value={this.state.emailId}/>
                    </Col>
                </FormGroup>


                 <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Phone Number <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Phone number" className={this.state.isDisabledPhoneNumber ? "error" : ""} onChange={this.handleBusinessPhoneNumberChange} value={this.state.phoneNumber}/>
                    </Col>
                </FormGroup> 


                <Row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Address <span className="required">*</span></Label>
                    </Col>
                </Row>

                <Row>
                  <Col xs="6">
                    <FormGroup>
                      

                       <Select
                        name="form-field-name"
                        value={value}
                        placeholder="Country"
                        onChange={this.handleChange}
                        className={this.state.isDisabledCountry ? "error" : ""}
                        options={this.state.countryDropDown}
                      />



                    </FormGroup>
                  </Col>
                </Row>


                <div className={this.state.countryAddress1 ? "address-display-none" : ""}>

                <Row>
                  <Col xs="4">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Unit no"  onChange={this.handleUnitNoChange} value={this.state.unitNo}/>



                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Floor"
                      //  className={this.state.isDisabledFloor ? "error" : ""} 
                       onChange={this.handleFloorChange} value={this.state.floor}/>


                    </FormGroup>
                  </Col>

                  <Col xs="4">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Building name"           
                      onChange={this.handleBuildingChange} value={this.state.building}/>


                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                    <Col xs="6">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Street no" className={this.state.isDisabledStreetNo ? "error" : ""} onChange={this.handleStreetNoChange} value={this.state.streetNo}/>



                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Street name" className={this.state.isDisabledStreet ? "error" : ""} onChange={this.handleStreetChange} value={this.state.street}/>


                    </FormGroup>
                  </Col>
                </Row>


                <Row>
                    <Col xs="12">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Road name1" className={this.state.isDisabledRoadName1 ? "error" : ""} onChange={this.handleRoadName1Change} value={this.state.roadName1}/>



                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                    <Col xs="12">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Road name2"  onChange={this.handleRoadName2Change} value={this.state.roadName2}/>



                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs="4">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Locality" onChange={this.handlelocalityChange}  className={this.state.isDisabledLocality ? "error" : ""}value={this.state.locality}/>



                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="City name" className={this.state.isDisabledCity ? "error" : ""} onChange={this.handleChangeCity} value={this.state.selectedOptionCity}/>


                    </FormGroup>
                  </Col>

                  <Col xs="4">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Postal Code" className={this.state.isDisabledPostalCode ? "error" : ""} onChange={this.handlePostalCodeChange} value={this.state.postalCode}/>


                    </FormGroup>
                  </Col>
                </Row>
                </div>











                <div className={this.state.countryAddress2 ? "address-display-none" : ""}>
                <Row>
                    <Col xs="4">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Unit no" className={this.state.isDisabledUnitNo ? "error" : ""} onChange={this.handleUnitNoChange} value={this.state.unitNo}/>



                    </FormGroup>
                  </Col>
                  <Col xs="8">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Building name" className={this.state.isDisabledBuilding ? "error" : ""} onChange={this.handleBuildingChange} value={this.state.building}/>


                    </FormGroup>
                  </Col>



                </Row>

                 <Row>
                    <Col xs="6">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Street no" className={this.state.isDisabledStreetNo ? "error" : ""} onChange={this.handleStreetNoChange} value={this.state.streetNo}/>



                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Street name" className={this.state.isDisabledStreet ? "error" : ""} onChange={this.handleStreetChange} value={this.state.street}/>


                    </FormGroup>
                  </Col>
                </Row>


                <Row>
                    <Col xs="6">
                    <FormGroup>
                      

                        <Input type="text" id="text-input" name="text-input" placeholder="Singapore"value="Singapore"  disabled/>



                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>              
              
                      <Input type="text" id="text-input" name="text-input" placeholder="Postal Code" className={this.state.isDisabledPostalCode ? "error" : ""} onChange={this.handlePostalCodeChange} value={this.state.postalCode}/>


                    </FormGroup>
                  </Col>
                </Row>

                </div>
      
                            
                </Form>
                <div className="form-actions">
                   {this.state.enablesave ? <Button type="submit" color="save-button" onClick={this.handleMerchantSubmit}>SAVE</Button> : <Button type="submit" color="save-button">SAVE</Button> } 
                  </div>
              </CardBody>
            </Card>
          </Col>
      </div>
    )
  }
}

export default MerchantAccount;
