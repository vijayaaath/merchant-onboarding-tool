import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {Animated} from "react-animated-css";
import 'react-datepicker/dist/react-datepicker.css';
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
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

//from find brand 
function merchantValidate(country, merchant) {
    // true means invalid, so our conditions got reversed
  
    return {
      country: country.length === 0,
      merchant: merchant.length === 0,
    };
  }




class addOffer_1 extends Component {



  constructor(props) {
    super(props);
    // this.handleChange_shortD = this.handleChange_shortD.bind(this,'shortD')
    // this.handleChange_midD = this.handleChange_midD.bind(this)
    // this.handleChange_longD = this.handleChange_longD.bind(this)
    // this.handleChange_promoC = this.handleChange_promoC.bind(this)
    // this.handleChange_redeemUrl = this.handleChange_redeemUrl.bind(this)
    // this.handleChange_eligibility = this.handleChange_eligibility.bind(this)
    
    this.previewImage = this.previewImage.bind(this)
    this.createOffer = this.createOffer.bind(this);
    this.makeOutletsArray = this.makeOutletsArray.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleMerchantChange = this.handleMerchantChange.bind(this);
    this.goToMerchant = this.goToMerchant.bind(this);
    this.state = {
            'brandId_status':false,
            brandId:'',
            'filename':'',
            "outletId" : '',
            "shortDesc" : "",
            "medDesc" : "",
            "longDesc" : "",
            "validFrom" : "",
            "validTo" : "",
            "postalCode" : "6000750",
            "promoCode" : "",
            "redeemUrl" : "www.kfc/offer-20.com",
            "eligibilityAndRemarks" : "purchase more than Rs.300",
            "offerRedeemOutlets" : "chennai and banglore",
            "brandImageOverride" : "none",
            "status" : "active",
            "tenantName" : "HDFC",
            requiredfield:'This field is required.',
            notValid:'Input is not valid.',
            errorBag:{},
            fields:{
                validFrom:moment(),
                validTo:moment()
            },
            selectedOption:[],
            Outlets:[],
            Outlets_view:[],
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
  }
  loadcountries()
  {

      var self = this;
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
              method: 'get',
              url: API_ROOT+'api/merchants/search/country',
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

  handleCountryChange(selectedCountry) {
    

    var self = this;
    self.setState({ selectedCountry });
    self.setState({ Country: selectedCountry.value });
   
      var auth = localStorage.getItem('auth');
      var body = {};
      axios({
              method: 'get',
              url: API_ROOT+'api/brands/search/city?name='+selectedCountry.value,
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {

                   response.data.city.map((obj, key)=> {

                self.setState({cityDropDown: [...self.state.cityDropDown, {value: obj,label: obj}]});
            });
            })
            .catch(function (error) {
               //self.setState({roles:[]});
            }.bind(this));


      axios({
     
              method: 'get',
              url: API_ROOT+'/api/brands/search/findBrandByCountry?name='+selectedCountry.value,
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
          this.setState({brandId_status:false})
          return;
        }

      localStorage.setItem('brandId', this.state.selectedMerchantId)
      this.setState({brandId_status:true})
      var outlets = this.makeOutletsArray();
  
    // this.setState({Outlets:outlets})
    //   const { history } = this.props;
    //   history.push('/base#brandId='+this.state.selectedMerchantId);
     // this.props.iftabsorfind()
  }


  merchantCanBeSubmitted() {

    const errors = merchantValidate(this.state.Country, this.state.Merchant);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledCountry: errors.country});
    this.setState({isDisabledMerchant: errors.merchant});
    return !isDisabled;
  }
 

  componentDidMount()
  {
    
    this.loadcountries();
  }
  handleChange(field, e){         
    let fields = this.state.fields;
    if(field == 'offerRedeemOutlets'){
        if(e){
          
            fields[field] = e;
            this.setState({selectedOption:e})
           
       // this.state.selectedOption = e.value;
        }
        
    }else if(field == 'validFrom' || field =='validTo'){
        fields[field] = e;
    }else{
        fields[field] = e.target.value;        
    }
   
    this.setState({fields});
}
makeDataForApi(){
    var data = new FormData();
    var outletsString = [];
    data.append('shortDesc',this.state.fields['shortDesc']);
    data.append('medDesc',this.state.fields['medDesc']);
    data.append('longDesc',this.state.fields['longDesc']);
    var from = moment(this.state.fields['validFrom']._d).format("YYYY-MM-DD hh:mm:ss");
    data.append('validFrom',from);
    var to = moment(this.state.fields['validTo']._d).format("YYYY-MM-DD hh:mm:ss");
    data.append('validTo',to);
   // data.append('validTo',this.state.fields['validTo']._d);
    data.append('promoCode',this.state.fields['promoCode']);
    data.append('eligibilityAndRemarks',this.state.fields['eligibilityAndRemarks']);
    data.append('redeemUrl',this.state.fields['redeemUrl']);
    if(this.state.fields['offerRedeemOutlets'][0].value == 'All'){
        for(var a=0;a<this.props.Outlets.length;a++){
          
            outletsString.push(this.props.Outlets[a].id);
        }
    }else{
        for(var a=0;a<this.state.fields['offerRedeemOutlets'].length;a++){
            outletsString.push(this.state.fields['offerRedeemOutlets'][a].value);
            //data.append('offerRedeemOutlets',this.state.fields['offerRedeemOutlets'][a].value);
           // data.append('offerRedeemOutlets',this.state.fields['offerRedeemOutlets'][a].value);
        }
    }
    
     data.append('offerRedeemOutlets',outletsString);
     if(document.getElementById('imagefile').files[0] != undefined){
        data.append('brandImageOverride',document.getElementById('imagefile').files[0]);
     }
   
    var tenantName = localStorage.getItem('tenantName');
    data.append('tenantName',tenantName);
    for (var pair of data.entries()) {
     
    }
  
    this.API_POST(data)
}
API_POST(data){
   
    var body = data;

    var auth = localStorage.getItem('auth');
   
 
    var that = this;
    return  axios({
        method: 'post',
        url: API_ROOT+'api/offers',
       // url: 'http://172.16.0.116:8888/'+'api/offers',
        data: body,
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
     
        if(response.status == 200){
            that.props.allOffers();
            that.props.change();
        }
       
      })
      .catch(function (error) {
       
      
      }.bind(this));
}
previewImage(){
 
    var name = document.getElementById('imagefile').value.replace(/C:\\fakepath\\/i, '');
    if(name  != undefined){
        this.setState({filename:name})
    }
}
createOffer(e){
      e.preventDefault();
  
     
    if(this.validateField()){
     
        this.makeDataForApi();
       
    }else{
         
    }
  }
  validateField(){
        let fields = this.state.fields;
        let errorBag = {};
        let formIsValid = true;
        if(!fields["shortDesc"]){
            formIsValid = false;
            errorBag["shortDesc"] = "This field is required.";
         }

    else if(fields['shortDesc'].length > 50){
        formIsValid = false;
        errorBag["shortDesc"] = "Maximum of 50 characters allowed";
    }
    if(!fields['medDesc']){
        formIsValid = false;
        errorBag["medDesc"] = "This field is required.";
    }else if( fields['medDesc'].length > 150){
        formIsValid = false;
        errorBag["medDesc"] = "Minimum of 75 and maximum of 150 characters  allowed.";
    }
    if(!fields['longDesc']){
        formIsValid = false;
        errorBag["longDesc"] = "This field is required.";
    }else if( fields['longDesc'].length > 300){
        formIsValid = false;
        errorBag["longDesc"] = "Minimum of 250 and maximum of 300 characters  allowed.";
    }
    if(!fields['validFrom']){
        formIsValid = false;
        errorBag["validFrom"] = "This field is required.";
    }
    if(!fields['validTo']){
        formIsValid = false;
        errorBag["validTo"] = "This field is required.";
    }
    if(!fields['promoCode']){
        formIsValid = false;
        errorBag["promoCode"] = "This field is required.";
    }else if(fields['promoCode'].length > 25){
        formIsValid = false;
        errorBag["promoCode"] = "Maximum 25 characters allowed";
    }
    if(!fields['eligibilityAndRemarks']){
        formIsValid = false;
        errorBag["eligibilityAndRemarks"] = "This field is required.";
    }
    if(!fields['redeemUrl']){
        formIsValid = false;
        errorBag["redeemUrl"] = "This field is required.";
    }
    if(!fields['offerRedeemOutlets']){
        formIsValid = false;
        errorBag["offerRedeemOutlets"] = "This field is required.";
    }
    
    
       this.setState({errorBag: errorBag});
       return formIsValid;
        
        
  }
  imageuploaderpop(){
      document.getElementById('imagefile').click();
  }
  fetchListOfOutlets(){
    //api/outlets/search/findByBrandId/3
  
    var body = {
      
      };
    var that = this;
    var auth = localStorage.getItem('auth');
    var brandId = localStorage.getItem('brandId');
  
    var that = this;
    if(brandId){
    return  axios({
        method: 'get',
        url: API_ROOT+'api/outlets/search/findByBrandId/'+brandId,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
     
       var outlets = response.data.results;
       that.setState({Outlets:outlets})
     
       var Outlets = [{value:'All',label:'Apply to all Outlets'}];
       if(that.state.Outlets){
        for(var a =0;a<that.state.Outlets.length;a++){
            var outlet = {
                value:that.state.Outlets[a].id,
                label:that.state.Outlets[a].name
            }
            Outlets.push(outlet);
        }
    }
    that.setState({Outlets:Outlets})
   
      })
      .catch(function (error) {
       
       
  }}   
makeOutletsArray(){
   
    this.fetchListOfOutlets();
   
    
}
ifbrandfound(){
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const { selectedCountry, selectedCity, selectedMerchant } = this.state;
    if(this.state.brandId_status){
        return 
        <Col xs="12" sm="12" md="12">
        <Animated animationIn="bounceInDown" animationOut="fadeOut" isVisible={true}>
                  <Row className="find-top">
                       <Col md="2">
                        &nbsp;
                       </Col>
                      <Col md="4" className="align-middle">
                      <FormGroup>
                      
                      <Select
                        name="form-field-name"
                        placeholder="Select Country..."
                        // value={selectedCountry}
                        // onChange={this.handleCountryChange}
                        // options={this.state.countryDropDown}
                        // className={this.state.isDisabledCountry ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>


                  


                    <Col md="4">
                      <FormGroup>
                      <Select
                        name="form-field-name"
                       // value={selectedMerchant}
                        placeholder="Select Brand..."
                        // onChange={this.handleMerchantChange}
                        // options={this.state.merchantDropDown}
                        // className={this.state.isDisabledMerchant ? "error" : ""}
                      />
                    </FormGroup>
                    </Col>

                    <Col md="2" className="align-middle">

                      <button className="btn btn-primary" onClick={this.goToMerchant}>Go</button>

                    </Col>




                  </Row>
                  </Animated>
       
        <Card className='main-card-style'>
          <CardHeader className='cardhead-main'>
                Add Offer
          </CardHeader>
         
          <CardBody>
        <form style={{padding:20+'px'}} onSubmit= {this.createOffer.bind(this)}>
            <FormGroup >
                <Label htmlFor="shortDesc" className='font-14' style={{fontWeight:600}}>Short Name of Offer </Label>
                <Input type="text" ref='shortDesc'  id="shortDesc" name="text-input" placeholder="Offer name" onChange={this.handleChange.bind(this, "shortDesc")} maxLength="50"/>
                <FormText color="muted">Tip:  50 characters or less <span className='pull-right' >Charecters left: ({this.state.fields['shortDesc']?50 -this.state.fields['shortDesc'].length : '50'})</span></FormText>
                <FormText color='red'>{this.state.errorBag["shortDesc"]}</FormText>
            </FormGroup>
            <FormGroup >
                <Label htmlFor="medDesc" className='font-14' style={{fontWeight:600}}>Mid Length Offer Description  </Label>
                <Input type="textarea" ref='medDesc' id="medDesc" name="text-input1" maxLength='150' placeholder="Offer description" onChange={this.handleChange.bind(this, "medDesc")}/>
                <FormText color="muted">Tip: 70 to 150 characters <span className='pull-right' >Charecters left: ({this.state.fields['medDesc']?150 -this.state.fields['medDesc'].length : '150'})</span></FormText>
                <FormText color='red'>{this.state.errorBag["medDesc"]}</FormText>
            </FormGroup>
            
            <FormGroup >
                <Label htmlFor="longDesc" className='font-14' style={{fontWeight:600}}>Full Offer Description (Optional) </Label>
                <Input type="textarea" id="longDesc" name="text-input2" maxLength ='300' placeholder="Offer description in detail" onChange={this.handleChange.bind(this, "longDesc")}/>
                <FormText color="muted">Tip: 250 to 300 characters <span className='pull-right' >Charecters left: ({this.state.fields['longDesc']?300 -this.state.fields['longDesc'].length : '300'})</span></FormText>
                <FormText color='red'>{this.state.errorBag["longDesc"]}</FormText>
            </FormGroup>
            <p  className='font-14' style={{fontWeight:600}}>Validity Period</p>
            <FormGroup row>
            <FormGroup inline className='col-md-3'>
               <Label htmlFor="validFrom">From</Label>
                {/* <Input type="text" id="validFrom" name="validFrom" placeholder="Enter from date" onChange={this.handleChange.bind(this, "validFrom")}/> */}
                <DatePicker
                    id="validFrom" 
                    name="validFrom"
                    className='form-control'
                    placeholder="Enter from date"
                    selected={this.state.fields['validFrom']}
                    onChange={this.handleChange.bind(this,'validFrom')}
                />
                <FormText color='red'>{this.state.errorBag['validFrom']}</FormText>
            </FormGroup>   
            <FormGroup inline className='col-md-3'>
                <Label htmlFor="validTo">To</Label>
                {/* <Input type="text" id="validTo" name="validTo" placeholder="Enter to date" onChange={this.handleChange.bind(this, "validTo")}/> */}
                <DatePicker
                    id="validTo" 
                    name="validTo"
                    className='form-control'
                    placeholder="Enter to date"
                    selected={this.state.fields['validTo']}
                    onChange={this.handleChange.bind(this,'validTo')}
                />
                <FormText color='red'>{this.state.errorBag['validTo']}</FormText>
                </FormGroup>  
              
              </FormGroup>
              <FormGroup row>
              <FormGroup inline className='col-md-3'>
                <Label htmlFor="promoCode" className='font-14' style={{fontWeight:600}}>Promo Code</Label>
                <Input type="text" id="promoCode" name="promoCode" placeholder="Type the code " onChange={this.handleChange.bind(this, "promoCode")}/>
                <FormText color="muted">Tip: 25 character only</FormText>
                <FormText color='red'>{this.state.errorBag['promoCode']}</FormText>
            </FormGroup>
            </FormGroup>
           
            <FormGroup >
                <Label htmlFor="eligibilityAndRemarks" className='font-14' style={{fontWeight:600}}> Remarks/Eligibility</Label>
                <Input type="text" id="eligibilityAndRemarks" name="eligibilityAndRemarks" placeholder="Type here" onChange={this.handleChange.bind(this, "eligibilityAndRemarks")}/>
                <FormText color='red'>{this.state.errorBag['eligibilityAndRemarks']}</FormText>
            </FormGroup>
            <FormGroup >
                <Label htmlFor="redeemUrl" className='font-14' style={{fontWeight:600}}> Redemption URL</Label>
                <Input type="text" id="redeemUrl" name="redeemUrl" placeholder="https://" onChange={this.handleChange.bind(this, "redeemUrl")}/>
                <FormText color='red'>{this.state.errorBag['redeemUrl']}</FormText>
            </FormGroup>
            <FormGroup row>
            
          
            <FormGroup inline className='col-md-6'>
                <Label htmlFor="offerRedeemOutlets" className='font-14' style={{fontWeight:600}}> Offer Redemption Outlets</Label>
                {/* <Input type="text" id="text-input8" name="text-input8" placeholder="Select applicable outlets"/> */}
                <Select
                    name="offerRedeemOutlets"
                    id='offerRedeemOutlets'
                    multi={true}
                    placeholder="Enter Offer Redemption Outlets"
                   value={selectedOption}
                    onChange={this.handleChange.bind(this, "offerRedeemOutlets")}
                    options={this.state.Outlets}
                  />
                 <FormText color='red'>{this.state.errorBag['offerRedeemOutlets']}</FormText>
            </FormGroup>
            </FormGroup>
            <FormGroup >
                <Label className='font-14' style={{fontWeight:600}}>Upload Images</Label>

                <Input type="file" id="imagefile" name="imagefile" style={{display:'none'}} onChange={this.previewImage}/>
                <FormText color="muted">Brand Images will be used by default.   If you would like to use a different image for this offer, you can override them with new Images.</FormText>
            </FormGroup>
            <FormGroup >
            <FormText color='muted'>{this.state.filename}</FormText>
                <Button color="warning" onClick={this.imageuploaderpop}>Override Brand Images</Button>
                
            </FormGroup>
            <br/>
            {/* <br/> */}
            <FormGroup >
                <Button color="save-button" onClick={this.createOffer}>Save</Button>
            </FormGroup>

            
      </form>
      </CardBody>
      </Card>
      </Col>

    }else{
        return (<Card>
        <CardHeader>
          <strong>Select the Brand where the offer will be added</strong>
        </CardHeader>
        <CardBody>

            <Row className="find-merchant-padding">
                 <Col md="1">
                  &nbsp;
                 </Col>
                <Col md="3" className="align-middle">
                <FormGroup>
                <Select
                  name="form-field-name"
                  value={selectedCountry}
                  placeholder="Select Country..."
                  onChange={this.handleCountryChange}
                  options={this.state.countryDropDown}
                  className={this.state.isDisabledCountry ? "error" : ""}
                />
              </FormGroup>
              </Col>


              <Col md="3">
                <FormGroup>
                <Select
                  name="form-field-name"
                  value={selectedCity}
                  placeholder="Select City..."
                  onChange={this.handleCityChange}
                  options={this.state.cityDropDown}                  
                />
                <span className="font-italic imageTextSmall text-muted">( Optional )</span>
              </FormGroup>
              </Col>


              <Col md="3">
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
      </Card>)
    }
}



  render() {
    // const { selectedOption } = this.state;
    // const value = selectedOption && selectedOption.value;
    // const { selectedCountry, selectedCity, selectedMerchant } = this.state;



    return (
        <div className="animated fadeIn">
        
         
         
         {this.ifbrandfound()}
         
       
        </div>
    )
  }
}

export default addOffer_1;
