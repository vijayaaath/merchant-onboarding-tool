import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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






class addOffer extends Component {



  constructor(props) {
    super(props);
    
     this.fillForm = this.fillForm.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.createOffer = this.createOffer.bind(this);
    this.makeOutletsArray = this.makeOutletsArray.bind(this);
    this.getallBrands = this.getallBrands.bind(this);
    this.getlocations = this.getlocations.bind(this);
    this.ifimage = this.ifimage.bind(this);
    this.state = {
        offerAdded:'',
           'viewOffer':'',
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
            Brands:'',
            selectedBrand:[],
            selectedLocation:[],
            Locations:[],
            requiredfield:'This field is required.',
            notValid:'Input is not valid.',
            errorBag:{},
            fields:{
                validFrom:moment(),
                validTo:moment(),
                "shortDesc" : "",
                "medDesc" : "",
                "longDesc" : "",
                "promoCode":'',
                "redeemUrl":'',
                "eligibilityAndRemarks":'',
                // "offerRedeemOutlets":[]

            },
            selectedOption:[],
            Outlets:[]
      
          
            
        
    };
  }
  
 

  componentDidMount()
  {
    var outlets = this.makeOutletsArray();
    this.setState({Outlets:outlets})
    setTimeout(()=>{
        this.getallBrands();
        if(this.props.viewOffer){
            this.fillForm();
        }
    },1000)
   
    // this.setState({Outlets:outlets})
  }
  getallBrands(){
   

    var auth = localStorage.getItem('auth');
   
    var id = this.props.match.params.merchantid;
    var that = this;
    return  axios({
        method: 'get',
        url: API_ROOT+'/api/brands/search/findByMerchantId/' + id,
       // url: 'http://172.16.0.116:8888/'+'api/offers',
      
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
    
        if(response.status == 200){
          that.setState({Brands:response.data.results})
        }
       
      })
      .catch(function (error) {
       
       
      }.bind(this));
  }
  fillForm(){
  
    let fields = this.state.fields;
    fields['shortDesc'] = this.props.viewOffer['shortDesc'];
    fields['medDesc'] = this.props.viewOffer.medDesc;
    fields['longDesc'] = this.props.viewOffer.longDesc;
   
    fields['validFrom'] = moment(this.props.viewOffer.valid_from);
    fields['validTo'] = moment(this.props.viewOffer.valid_to);
     fields['promoCode'] = this.props.viewOffer.promoCode;
     fields['eligibilityAndRemarks'] = this.props.viewOffer.eligibilityAndRemarks;
     fields['redeemUrl'] = this.props.viewOffer.redeemUrl;
     //fields['offerRedeemOutlets'] = this.props.viewOffer

     var t ={};
     var outlets=[]
     for(var a=0;a<this.props.viewOffer.offerRedeemOutlets.length;a++){
        t={
            label:this.props.viewOffer.offerRedeemOutlets[a].locationId,
            value:this.props.viewOffer.offerRedeemOutlets[a].outletId
        }
        outlets.push(t)

     }
     this.setState({selectedBrand:{label:this.props.viewOffer.brand.name,value:this.props.viewOffer.brand.brandId}})
     setTimeout(()=>{
         this.getlocations({label:this.props.viewOffer.brand.name,value:this.props.viewOffer.brand.brandId})
     },10)
     this.setState({selectedOption:outlets})
      fields['offerRedeemOutlets'] = outlets;
    
   this.setState({fields})
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
    }else if(field == 'brandSelection'){
        this.setState({Locations:[]})
        this.setState({selectedBrand:e})
        this.getlocations(e)
    }else if (field == 'location'){
        //var selectedLocation = this.state.selectedLocation;
        // selectedLocation.push(e)
        this.setState({Outlets:[]})
        this.setState({selectedLocation:e})
        // if(e.value == 'Location'){
        //     var emptyArray = [];
        //     for(var a=0;a<this.state.Locations.length;a++){
        //         if(e.value != 'Location'){
        //             emptyArray.push(e.value)
        //         }
        //     }
        //     this.getOutlets(emptyArray)
        // }
        // else
        // {
            this.getOutlets(e)
        // }
       
    }
        else{
       
         
            fields[field] = e.target.value;     
        
          
    }
   
    this.setState({fields});
}
getOutlets(selectedLocation){
    
    var auth = localStorage.getItem('auth')
    var self = this;
    var cityCountry = [];
    cityCountry.push(selectedLocation[0].label)
    if(this.state.selectedBrand){
        var body = {
            brandId: this.state.selectedBrand.value,
            cityCountry:cityCountry
          }
    }else{
        var body={}
    }
    axios({
        method: 'post',
            
             url: API_ROOT+'api/outlets/search/findByBrandId/',
             data: body,
             headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

             })
             .then(function (response) {

             
                  response.data.results.map((obj, key)=> {

               self.setState({Outlets: [...self.state.Outlets, {value: obj.id,label: obj.name}]});
           });
           })
           .catch(function (error) {
              //self.setState({roles:[]});
           }.bind(this));
}
getlocations(selectedBrand){
    var body={};
    var auth = localStorage.getItem('auth')
    var self = this;
    
    axios({
      
        method: 'get',
            
             url: API_ROOT+'api/outlets/cityCountry?merchantId='+this.props.match.params.merchantid+'&brandName='+selectedBrand.label,
             data: body,
             headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

             })
             .then(function (response) {
                  response.data.map((obj, key)=> {

               self.setState({Locations: [...self.state.Locations, {value: obj,label: obj}]});
           });
           })
           .catch(function (error) {
              //self.setState({roles:[]});
           }.bind(this));
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
   
    var url = '';
    if(this.props.viewOffer){
        var id =this.props.viewOffer.offerId;
        url = API_ROOT+'api/offers/'+id
    }else{
        url = API_ROOT+'api/offers'
    }
    var that = this;
    return  axios({
        method: 'post',
        url: url,
       // url: 'http://172.16.0.116:8888/'+'api/offers',
        data: body,
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
    
        if(response.status == 200){
            that.props.allOffers();
            that.props.change();
            window.scrollTo(0, 0);
            that.setState({offerAdded:'Offer Added'})
            if(that.props.viewOffer)
            {
              const { history } = that.props;
              history.push('/managemerchant/'+that.props.match.params.merchantid+'/4/offerupdated');  
            }
            else
            {
              const { history } = that.props;
              history.push('/managemerchant/'+that.props.match.params.merchantid+'/4/offercreated');  
            }
            
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
    if(this.state.selectedBrand == null || this.state.selectedBrand.length ==0){
        formIsValid = false;
        errorBag['selectedBrand'] = 'This field is required'
    } //1 st
    if(this.state.selectedLocation == null || this.state.selectedLocation.length ==0){
        formIsValid = false;
        errorBag['selectedLocation'] = 'This field is required'
    }//2nd
    // if(!fields['longDesc']){
    //     formIsValid = false;
    //     errorBag["longDesc"] = "This field is required.";
    // }else if( fields['longDesc'].length > 300){
    //     formIsValid = false;
    //     errorBag["longDesc"] = "Minimum of 250 and maximum of 300 characters  allowed.";
    // }
    if(!fields['validFrom']){
        formIsValid = false;
        errorBag["validFrom"] = "This field is required.";
    }
    if(!fields['validTo']){
        formIsValid = false;
        errorBag["validTo"] = "This field is required.";
    }
    // if(!fields['promoCode']){
    //     formIsValid = false;
    //     errorBag["promoCode"] = "This field is required.";
    // }else if(fields['promoCode'].length > 25){
    //     formIsValid = false;
    //     errorBag["promoCode"] = "Maximum 25 characters allowed";
    // }
    if(!fields['eligibilityAndRemarks']){
        formIsValid = false;
        errorBag["eligibilityAndRemarks"] = "This field is required.";
    }
    // if(!fields['redeemUrl']){
    //     formIsValid = false;
    //     errorBag["redeemUrl"] = "This field is required.";
    // }
    if(!fields['offerRedeemOutlets'] || fields['offerRedeemOutlets'].length == 0){
        formIsValid = false;
        errorBag["offerRedeemOutlets"] = "This field is required.";
    }
    
    
       this.setState({errorBag: errorBag});
       return formIsValid;
        
        
  }
  imageuploaderpop(){
      document.getElementById('imagefile').click();
  }
    
makeOutletsArray(){
    var Outlets = [{value:'All',label:'Apply to all Outlets'}];
  
    if(this.props.Outlets){
        for(var a =0;a<this.props.Outlets.length;a++){
            var outlet = {
                value:this.props.Outlets[a].id,
                label:this.props.Outlets[a].name
            }
            Outlets.push(outlet);
        }
    }
    
    return Outlets;
}
ifimage(){
    if(this.props.viewOffer){
        if(this.props.viewOffer.imageResponse.length > 0){
            return <div className='image-cards' style={{width:'250px'}} >
                     <img src={this.props.viewOffer.imageResponse[0].image} className='image_style'/>
                </div>
        }else{
            return ''
        }
        
    }else{
        return ''
    }
}


  render() {

    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const { selectedBrand } = this.state;
    const value1 = selectedBrand && selectedBrand.value;
    const {selectedLocation} = this.state;
    const value2 = selectedLocation && selectedLocation.value;

    
    



    return (
        <div className="animated fadeIn">
          
            <form style={{padding:20+'px'}} onSubmit= {this.createOffer.bind(this)}>
            <FormText color='green'>{this.state.offerAdded}</FormText>
            <FormGroup row>
            <FormGroup inline className='col-md-6'>

                    <Label htmlFor="offerRedeemOutlets" className='font-14' style={{fontWeight:600}}> Select Brand <span className="required">*</span></Label>

                    {/* <Input type="text" id="text-input8" name="text-input8" placeholder="Select applicable outlets"/> */}
                    <Select
                        name="brands"
                        id='brands'
                        placeholder="Please select brand"
                       value={selectedBrand}
                        onChange={this.handleChange.bind(this, "brandSelection")}
                        options={this.state.Brands}
                      />
                       <FormText color='red'>{this.state.errorBag['selectedBrand']}</FormText>
                     {/* <FormText color='red'>{this.state.errorBag['offerRedeemOutlets']}</FormText> */}
                </FormGroup>
                </FormGroup>
                <FormGroup >
                    <Label htmlFor="shortDesc" className='font-14' style={{fontWeight:600}}>Offer Title <span className="required">*</span></Label>
                    <Input type="text" ref='shortDesc' value ={this.state.fields.shortDesc}  id="shortDesc" name="text-input" placeholder="Offer name" onChange={this.handleChange.bind(this, "shortDesc")} maxLength="50"/>
                    <FormText color="muted">Tip:  50 characters or less <span className='pull-right' >Charecters left: ({this.state.fields['shortDesc']?50 -this.state.fields['shortDesc'].length : '50'})</span></FormText>
                    <FormText color='red'>{this.state.errorBag["shortDesc"]}</FormText>
                </FormGroup>
                <FormGroup >
                    <Label htmlFor="medDesc" className='font-14' style={{fontWeight:600}}>Offer Description  <span className="required">*</span></Label>
                    <Input type="textarea" value ={this.state.fields.medDesc} ref='medDesc' id="medDesc" name="text-input1" maxLength='150' placeholder="Offer description" onChange={this.handleChange.bind(this, "medDesc")}/>
                    <FormText color="muted">Tip: 70 to 150 characters <span className='pull-right' >Charecters left: ({this.state.fields['medDesc']?150 -this.state.fields['medDesc'].length : '150'})</span></FormText>
                    <FormText color='red'>{this.state.errorBag["medDesc"]}</FormText>
                </FormGroup>
                
                
                <p  className='font-14' style={{fontWeight:600}}>Validity Period</p>
                <FormGroup row>
                <FormGroup inline className='col-md-3'>
                   <Label className='font-14' style={{fontWeight:600}}>From</Label>
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
                    <Label className='font-14' style={{fontWeight:600}}>To</Label>
                    {/* <Input type="text" id="validTo" name="validTo" placeholder="Enter to date" onChange={this.handleChange.bind(this, "validTo")}/> */}
                    <DatePicker
                        id="validTo" 
                        name="validTo"
                        className='form-control'
                        placeholder="Enter to date"
                        selected={this.state.fields['validTo']}
                        minDate={this.state.fields['validFrom']}
                        onChange={this.handleChange.bind(this,'validTo')}
                    />
                    <FormText color='red'>{this.state.errorBag['validTo']}</FormText>
                    </FormGroup>  
                  
                  </FormGroup>
                  <FormGroup row>
                  <FormGroup inline className='col-md-3'>
                    <Label htmlFor="promoCode" className='font-14' style={{fontWeight:600}}>Promo Code</Label>
                    <Input type="text" id="promoCode" name="promoCode" value ={this.state.fields.promoCode} placeholder="Type the code " onChange={this.handleChange.bind(this, "promoCode")}/>
                    <FormText color="muted">Tip: 25 characters only</FormText>
                    <FormText color='red'>{this.state.errorBag['promoCode']}</FormText>
                </FormGroup>
                </FormGroup>
               
                <FormGroup >
                    <Label htmlFor="eligibilityAndRemarks" className='font-14' style={{fontWeight:600}}> Remarks/Eligibility <span className="required">*</span></Label>
                    <Input type="text" id="eligibilityAndRemarks" value ={this.state.fields.eligibilityAndRemarks} name="eligibilityAndRemarks" placeholder="Type here" onChange={this.handleChange.bind(this, "eligibilityAndRemarks")}/>
                    <FormText color='red'>{this.state.errorBag['eligibilityAndRemarks']}</FormText>
                </FormGroup>
                <FormGroup >
                    <Label htmlFor="redeemUrl" className='font-14' style={{fontWeight:600}}> Redemption URL</Label>
                    <Input type="text" id="redeemUrl" value ={this.state.fields.redeemUrl} name="redeemUrl" placeholder="https://" onChange={this.handleChange.bind(this, "redeemUrl")}/>
                    <FormText color='red'>{this.state.errorBag['redeemUrl']}</FormText>
                </FormGroup>
                <FormGroup row>
                <FormGroup inline className='col-md-6'>
                    <Label htmlFor="location" className='font-14' style={{fontWeight:600}}> Choose Location <span className="required">*</span></Label>
                    {/* <Input type="text" id="text-input8" name="text-input8" placeholder="Select applicable outlets"/> */}
                    <Select
                        name="location"
                        id='location'
                        multi={true}
                        placeholder="Select Location"
                        value={selectedLocation}
                        onChange={this.handleChange.bind(this, "location")}
                        options={this.state.Locations}
                      />
                     <FormText color='red'>{this.state.errorBag['selectedLocation']}</FormText>
                </FormGroup>
                <FormGroup inline className='col-md-6'>
                    <Label htmlFor="offerRedeemOutlets" className='font-14' style={{fontWeight:600}}> Offer Redemption Outlets <span className="required">*</span></Label>
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
                     <FormText >Choose location</FormText>
                </FormGroup>
                </FormGroup>
                <FormGroup >
                    <Label className='font-14' style={{fontWeight:600}}>Upload Images</Label>

                    <Input type="file" id="imagefile" name="imagefile" style={{display:'none'}} onChange={this.previewImage}/>
                    <FormText color="muted">Brand Images will be used by default.   If you would like to use a different image for this offer, you can override them with new Images.</FormText>
                </FormGroup>
                <FormGroup >
                <FormText color='muted'>{this.state.filename}</FormText>
                {this.ifimage()}
                    <Button color="warning" onClick={this.imageuploaderpop}>Override Brand Images</Button>
                   
                </FormGroup>
                <br/>
                {/* <br/> */}
                <FormGroup >
                    <Button color="save-button" onClick={this.createOffer}>Save</Button>
                </FormGroup>

                
          </form>
          
         
         
         
       
        </div>
    )
  }
}

export default addOffer;
