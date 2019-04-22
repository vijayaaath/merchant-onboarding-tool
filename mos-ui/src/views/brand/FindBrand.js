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




function merchantValidate(country, merchant) {
  // true means invalid, so our conditions got reversed

  return {
    country: country.length === 0,
    merchant: merchant.length === 0,
  };
}






class FindMerchant extends Component {


   constructor(props) {
    super(props);
   this.state = { 
      selectedCountry: '',
      selectedCity: '',
      selectedMerchant: '',
      isDisabledCountry: false,
      isDisabledCity: false,
      isDisabledMerchant: false,
      Country: '',
      City: '',
      Merchant: '',
      countryDropDown: [],
      cityDropDown: [],
      merchantDropDown: [],
      selectedMerchantId:  '',
    };
   
   this.handleCountryChange = this.handleCountryChange.bind(this);
   this.handleCityChange = this.handleCityChange.bind(this);
   this.handleMerchantChange = this.handleMerchantChange.bind(this);
   this.goToMerchant = this.goToMerchant.bind(this);

  }

  componentDidMount()
  {
    this.loadcountries();
  }


  loadcountries()
  {

      var self = this;
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
              method: 'get',
              url: API_ROOT+'api/brands/cityCountry',
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {
                   response.data.map((obj, key)=> {

                self.setState({countryDropDown: [...self.state.countryDropDown, {value: obj,label: obj}]});
            });
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));
  }

  handleCountryChange(selectedCountry) {
    

    var self = this;
    self.setState({ selectedCountry });
    self.setState({ Country: selectedCountry.value });
  
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
     
              method: 'get',
              url: API_ROOT+'api/brands/search/findBrand/'+selectedCountry.value,
              
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {

           
                   response.data.results.map((obj, key)=> {

                self.setState({merchantDropDown: [...self.state.merchantDropDown, {value: obj.id,label: obj.name}]});
            });
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));




  }

  handleCityChange(selectedCity) {
    var self = this;
    self.setState({ selectedCity });
    self.setState({ City: selectedCity.value });

     var auth = localStorage.getItem('auth');
      var body = {};

    axios({
              method: 'get',
             
              url: API_ROOT+'/api/brands/search/findBrandByCity?name='+selectedCity.value,
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {

         
                   response.data.results.map((obj, key)=> {

                self.setState({merchantDropDown: [...self.state.merchantDropDown, {value: obj.id,label: obj.name}]});
            });
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));




  }

  handleMerchantChange(selectedMerchant) {
    this.setState({ selectedMerchant });
    this.setState({ Merchant: selectedMerchant.value });
    this.setState({ selectedMerchantId: selectedMerchant.value });
  }

  goToMerchant(evt)
  {
    if (!this.merchantCanBeSubmitted()) {
          evt.preventDefault();
          return;
        }

      localStorage.setItem('brandName', this.state.selectedMerchant.label)
      const { history } = this.props;
      history.push('/base#brandName='+this.state.selectedMerchant.label);
     //this.props.iftabsorfind()
  }


  merchantCanBeSubmitted() {

    const errors = merchantValidate(this.state.Country, this.state.Merchant);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledCountry: errors.country});
    this.setState({isDisabledMerchant: errors.merchant});
    return !isDisabled;
  }


  render() {

     const { selectedCountry, selectedCity, selectedMerchant } = this.state;
     
    return (
      <div className="animated fadeIn">

          <h3>Find Brand</h3>
           <Card className="card-border">
              <CardBody className="cardbody-padding-bottom-zero">

                  <Row className="find-merchant-padding">
                       <Col md="2">
                        &nbsp;
                       </Col>
                      <Col md="4" className="align-middle">
                      <FormGroup>
                      
                      <Select
                        name="form-field-name"
                        value={selectedCountry}
                        placeholder="Select City,Country..."
                        onChange={this.handleCountryChange}
                        options={this.state.countryDropDown}
                        className={this.state.isDisabledCountry ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>


                  


                    <Col md="4">
                      <FormGroup>
                      <Select
                        name="form-field-name"
                        value={selectedMerchant}
                        placeholder="Select Brand..."
                        onChange={this.handleMerchantChange}
                        options={this.state.merchantDropDown}
                        className={this.state.isDisabledMerchant ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>

                    <Col md="1" className="align-middle">

                      <button className="btn btn-primary" onClick={this.goToMerchant}>Go</button>

                    </Col>




                  </Row>



              </CardBody>
            </Card>
      </div>
    )
  }
}

export default FindMerchant;
