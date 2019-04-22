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
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';






class addOutlet extends Component {



  constructor(props) {
    super(props);
   this.Address_RETURN_TYPE = this.Address_RETURN_TYPE.bind(this);
   this.INDIA_ADDRESS = this.INDIA_ADDRESS.bind(this);
   this.checkOutlet = this.checkOutlet.bind(this)
   this.SINGAPORE_ADDRESS = this.SINGAPORE_ADDRESS.bind(this);
    this.state = {
      
        value : moment(),
        value1: moment(),
        outletexist: false,
        country_LIST:[{value:'India', label:'India'},{value:'Singapore', label:'Singapore'}],
        selected_COUNTRY:{},
 
    
           fields:{
               'outletAdded':'',
               'locationId':'',
               'uniqOutletQualities':'',
               'country':'',
               'streetNo':'',
               'floor':'',
               'street':'',
               'buildingName':'',
               'city':'',
               'state':'',
               'unitNo':'',
               'locality':'',
               'postalCode':'',
               'roadName2':'',
               'roadName1':'',
               'phone':'',
               'mondayFrom':'',
               'tuesdayFrom':'',
               'wednesdayFrom':'',
               'thursdayFrom':'',
               'fridayFrom':'',
               'saturdayFrom':'',
               'sundayFrom':'',
               'mondayTo':'',
               'tuesdayTo':'',
               'wednesdayTo':'',
               'thursdayTo':'',
               'fridayTo':'',
               'saturdayTo':'',
               'sundayTo':'',
               
               


           },
           errorBag:{}
        
    };
  }
  handleChangeTime(field,e){

    let fields = this.state.fields;
    if(e){
        fields[field] = e;
    }
    if(field == 'mondayFrom'){
        fields['tuesdayFrom'] = e;
        fields['wednesdayFrom'] = e;
        fields['thursdayFrom'] = e;
        fields['fridayFrom'] = e;
        fields['saturdayFrom'] = e;
        fields['sundayFrom'] = e;

    }
    if(field == 'mondayTo'){
        fields['tuesdayTo'] = e;
        fields['wednesdayTo'] = e;
        fields['thursdayTo'] = e;
        fields['fridayTo'] = e;
        fields['saturdayTo'] = e;
        fields['sundayTo'] = e;
    }
    if(field == 'tuesdayFrom' || field == 'wednesdayFrom' || field == 'thursdayFrom' || field == 'fridayFrom' || field == 'saturdayFrom' || field == 'sundayFrom'){
        // this.setState({value:e})
    }
    if(field == 'tuesdayTo' || field == 'wednesdayTo' || field == 'thursdayTo' || field == 'fridayTo' || field == 'saturdayTo' || field == 'sundayTo'){
        // this.setState({value1:e})
    }
   
    
    this.setState({fields});
  }
  handleChange(field, e){  

    let fields = this.state.fields;

    if(field == 'locationId')
    {
        var self = this;
        var auth = localStorage.getItem('auth');
        var data = {};
        axios({
          method: 'get',
          url: API_ROOT+'api/outlets/findIfoutletExistsForBrandName?brandName='+window.location.href.split('#brandName=')[1]+'&outletName='+e.target.value,
          data: data,
          headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

          })
          .then((response) => {
  
              if(response.data)
              {
                self.setState({outletexist: true});                
              }
              else
              {
                self.setState({outletexist: false});                 
              }
            
            
        })
        .catch(function (error) {
      
        }.bind(this));
    }


    if(field == 'country'){
        this.setState({selected_COUNTRY:e})
    }
    if(field == 'offerRedeemOutlets'){
        if(e){
            fields[field] = e.value;
        this.state.selectedOption = e.value;
        }
        
    }else if(field == 'mondayFrom' ){
     
    }else{
        if(field == 'country'){
            if(e != null)
            fields[field] = e.value;
            else
            fields[field]=''
        }else{
            fields[field] = e.target.value;
        }
       
    }
   
    this.setState({fields});
}
checkOutlet(){
    setTimeout(()=>{
        let errorBag = {};
        var that = this;
        if(!this.props.sendData){
            var brandName = window.location.href.split('#brandName=')[1];
            var outletName = this.state.fields['locationId']
            var auth = localStorage.getItem('auth')
        return  axios({
            method: 'get',
            url: API_ROOT+'api/outlets/findIfoutletExistsForBrandName?brandName='+brandName +'&outletName='+ outletName,
         
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
    
            })
            .then(function (response) {
            localStorage.setItem('auth', auth);
          
            if(response.data){
                errorBag["locationId"] = `this outlet already exist for ${brandName}`
                that.setState({errorBag})
            }else{
                errorBag["locationId"] = ``
                that.setState({errorBag})
            }
    
            
           
          })
          .catch(function (error) {
           
         
          }.bind(this));
        }
    },500)
   
}
createAnother(e){
    this.createOutlet('another');
}
createOutlet(text = '',e){
    if(e){
        e.preventDefault();
    }
    

  if(this.validateField()){
    
      this.makeDataforApi(text);
    

  }else{
     
     
  }
}
Address_RETURN_TYPE(){
    if(this.state.fields['country']== ''){
        return ;
    }else if (this.state.fields['country']=='India'){
        return this.INDIA_ADDRESS()
    }else if (this.state.fields['country']=='Singapore'){
       return this.SINGAPORE_ADDRESS()
    }
}
INDIA_ADDRESS(){
   return(
    <div>
        <FormGroup row className='margin-7'>
            <FormGroup inline className='col-md-4'>
                <Input type="number" id="unitNo" name="unitNo" value={this.state.fields['unitNo']} placeholder="Enter unit number" onChange={this.handleChange.bind(this, "unitNo")}/>
                <FormText color='red'>{this.state.errorBag["unitNo"]}</FormText>
            </FormGroup>  
            <FormGroup inline className='col-md-4'>
                <Input type="number" id="floor" name="floor" value={this.state.fields['floor']} placeholder="Enter floor" onChange={this.handleChange.bind(this, "floor")}/>
                <FormText color='red'>{this.state.errorBag["floor"]}</FormText>
            </FormGroup> 
            <FormGroup   className='col-md-4'>
                <Input type="text" id="buildingName" name="buildingName"  value={this.state.fields['buildingName']} placeholder="Building name" onChange={this.handleChange.bind(this, "buildingName")}/>
                <FormText color='red'>{this.state.errorBag["buildingName"]}</FormText>
            </FormGroup>
        </FormGroup>  
        <FormGroup row className='margin-7'>
            <FormGroup inline className='col-md-6'>
                <Input type="number" id="streetNo" value={this.state.fields['streetNo']} name="streetNo" placeholder="Street number" onChange={this.handleChange.bind(this, "streetNo")}/>
                <FormText color='red'>{this.state.errorBag["streetNo"]}</FormText>
            </FormGroup> 
            <FormGroup   className='col-md-6'>
                <Input type="text" id="street" name="text-input5" value={this.state.fields['street']} placeholder="Street name" onChange={this.handleChange.bind(this, "street")}/>
                <FormText color='red'>{this.state.errorBag["street"]}</FormText>
            </FormGroup>
        </FormGroup> 
        <FormGroup row className='margin-7'>
            <FormGroup   className='col-md-12'>
                <Input type="text" id="roadName1" name="roadName1" value={this.state.fields['roadName1']} placeholder="Road Name 1" onChange={this.handleChange.bind(this, "roadName1")}/>
                <FormText color='red'>{this.state.errorBag["roadName1"]}</FormText>
            </FormGroup>
        </FormGroup> 
        <FormGroup row className='margin-7'>
            <FormGroup   className='col-md-12'>
                <Input type="text" id="roadName2" name="roadName2" value={this.state.fields['roadName2']} placeholder="Road Name 2" onChange={this.handleChange.bind(this, "roadName2")}/>
                <FormText color='red'>{this.state.errorBag["roadName2"]}</FormText>
            </FormGroup>
        </FormGroup> 
        <FormGroup row className='margin-7'>
            <FormGroup  inline   className='col-md-4'>
                <Input type="text" id="locality" value={this.state.fields['locality']} name="locality" placeholder="locality" onChange={this.handleChange.bind(this, "locality")}/>
                <FormText color='red'>{this.state.errorBag["locality"]}</FormText>
            </FormGroup>
            <FormGroup inline   className='col-md-4'>
                <Input type="text" id="city" name="city" value={this.state.fields['city']} placeholder="City" onChange={this.handleChange.bind(this, "city")}/>
                <FormText color='red'>{this.state.errorBag["city"]}</FormText>
            </FormGroup>
            <FormGroup  inline   className='col-md-4'>
                <Input type="number" id="postalCode" value={this.state.fields['postalCode']} name="postalCode" placeholder="Postal code" onChange={this.handleChange.bind(this, "postalCode")}/>
                <FormText color='red'>{this.state.errorBag["postalCode"]}</FormText>
            </FormGroup>
        </FormGroup>
    </div>
   )
}
SINGAPORE_ADDRESS(){
    return(
        <div>
        <FormGroup row className='margin-7'>
            <FormGroup inline className='col-md-6'>
                <Input type="number" id="unitNo" name="unitNo" value={this.state.fields['unitNo']} placeholder="Enter unit number" onChange={this.handleChange.bind(this, "unitNo")}/>
                <FormText color='red'>{this.state.errorBag["unitNo"]}</FormText>
            </FormGroup>  
            
            <FormGroup   className='col-md-6'>
                <Input type="text" id="buildingName" name="buildingName"  value={this.state.fields['buildingName']} placeholder="Building name" onChange={this.handleChange.bind(this, "buildingName")}/>
                <FormText color='red'>{this.state.errorBag["buildingName"]}</FormText>
            </FormGroup>
        </FormGroup>  
        <FormGroup row className='margin-7'>
            <FormGroup inline className='col-md-6'>
                <Input type="number" id="streetNo" value={this.state.fields['streetNo']} name="streetNo" placeholder="Street number" onChange={this.handleChange.bind(this, "streetNo")}/>
                <FormText color='red'>{this.state.errorBag["streetNo"]}</FormText>
            </FormGroup> 
            <FormGroup   className='col-md-6'>
                <Input type="text" id="street" name="text-input5" value={this.state.fields['street']} placeholder="Street name" onChange={this.handleChange.bind(this, "street")}/>
                <FormText color='red'>{this.state.errorBag["street"]}</FormText>
            </FormGroup>
        </FormGroup> 
        <FormGroup row className='margin-7'>
            <FormGroup inline   className='col-md-6'>
                <Input type="text" id="city" name="city" value={this.state.fields['city']} placeholder="City" onChange={this.handleChange.bind(this, "city")}/>
                <FormText color='red'>{this.state.errorBag["city"]}</FormText>
            </FormGroup>
            <FormGroup  inline   className='col-md-6'>
                <Input type="number" id="postalCode" value={this.state.fields['postalCode']} name="postalCode" placeholder="Postal code" onChange={this.handleChange.bind(this, "postalCode")}/>
                <FormText color='red'>{this.state.errorBag["postalCode"]}</FormText>
            </FormGroup>
        </FormGroup>
    </div>
    )
}
makeDataforApi(text = ''){

    var brandName = window.location.href.split('#brandName=')[1];
    
    var tenantName = localStorage.getItem('tenantName');


    if(this.state.fields['mondayFrom']!='')
    {
      var monday_from = this.state.fields['mondayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var monday_from = '00:00:00';
    }

    if(this.state.fields['mondayTo']!='')
    {
      var monday_to = this.state.fields['mondayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var monday_to = '00:00:00';
    }

    if(this.state.fields['tuesdayFrom']!='')
    {
      var tuesday_from = this.state.fields['tuesdayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var tuesday_from = '00:00:00';
    }

    if(this.state.fields['tuesdayTo']!='')
    {
      var tuesday_to = this.state.fields['tuesdayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var tuesday_to = '00:00:00';
    }
    if(this.state.fields['wednesdayFrom']!='')
    {
      var wednesday_From = this.state.fields['wednesdayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var wednesday_From = '00:00:00';
    }
    if(this.state.fields['wednesdayTo']!='')
    {
      var wednesday_to = this.state.fields['wednesdayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var wednesday_to = '00:00:00';
    }

    if(this.state.fields['thursdayFrom']!='')
    {
      var thursday_From = this.state.fields['thursdayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var thursday_From = '00:00:00';
    }

    if(this.state.fields['thursdayTo']!='')
    {
      var thursday_to = this.state.fields['thursdayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var thursday_to = '00:00:00';
    }
    if(this.state.fields['fridayFrom']!='')
    {
      var friday_From = this.state.fields['fridayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var friday_From = '00:00:00';
    }

    if(this.state.fields['fridayTo']!='')
    {
      var friday_to = this.state.fields['fridayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var friday_to = '00:00:00';
    }

    if(this.state.fields['saturdayFrom']!='')
    {
      var saturday_From = this.state.fields['saturdayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var saturday_From = '00:00:00';
    }

    if(this.state.fields['saturdayTo']!='')
    {
      var saturday_to = this.state.fields['saturdayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var saturday_to = '00:00:00';
    }

    if(this.state.fields['sundayFrom']!='')
    {
      var sunday_From = this.state.fields['sundayFrom']._d.toString().split(' ')[4]
    }
    else
    {
      var sunday_From = '00:00:00';
    }

    if(this.state.fields['sundayTo']!='')
    {
      var sunday_to = this.state.fields['sundayTo']._d.toString().split(' ')[4]
    }
    else
    {
      var sunday_to = '00:00:00';
    }

    
    var data  = {
        "brandName" : window.location.href.split('#brandName=')[1],
        locationId:this.state.fields['locationId'],
        uniqOutletQualities:this.state.fields['uniqOutletQualities'],
        address:{
            country:this.state.fields['country'],
            cityName:this.state.fields['city'],
            floor:this.state.fields['floor'],
            roadName1:this.state.fields['roadName1'],
            roadName2:this.state.fields['roadName2'],
            unitNo:this.state.fields['unitNo'],
            streetNo:this.state.fields['streetNo'],
            streetName:this.state.fields['street'],
            buildingName:this.state.fields['buildingName'],
            state:this.state.fields['state'],
            postalCode:this.state.fields['postalCode'],
            locality:this.state.fields['locality']
        },
        phone:this.state.fields['phone'],
        // "url": "www.kfc-chennai.com",
        "openingHours": {
            "monday":  monday_from + ' - ' + monday_to,
            "tuesday":  tuesday_from + ' - ' + tuesday_to ,
            "wednesday":  wednesday_From + ' - ' + wednesday_to,
            "thursday": thursday_From + ' - ' + thursday_to,
            "friday": friday_From + ' - ' + friday_to,
            "saturday": saturday_From + ' - ' + saturday_to,
            "sunday": sunday_From + ' - ' + sunday_to 
        },
      
        tenantName:tenantName
    

    }
  
    this.CREATE_API(data,text)
}
CREATE_API(data,text = ''){
    var body = data;

    var auth = localStorage.getItem('auth');
   
    if(!this.props.sendData){
    var that = this;
    return  axios({
        method: 'post',
        url: API_ROOT+'/api/outlets/addByBrandName',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
    
        if(response.status == 200){
            if(text.length > 1){
                that.setState({fields:{
                'locationId':'',
               'uniqOutletQualities':'',
               'country':'',
               'streetNo':'',
               'street':'',
               'buildingName':'',
               'city':'',
               'state':'',
               'roadName1':'',
               'roadName2':'',
               'floor':'',
               'postalCode':'',
               'phone':'',
               'mondayFrom':moment(),
               'tuesdayFrom':moment(),
               'wednesdayFrom':moment(),
               'thursdayFrom':moment(),
               'fridayFrom':moment(),
               'saturdayFrom':moment(),
               'sundayFrom':moment(),
               'mondayTo':moment(),
               'tuesdayTo':moment(),
               'wednesdayTo':moment(),
               'thursdayTo':moment(),
               'fridayTo':moment(),
               'saturdayTo':moment(),
               'sundayTo':moment(),
                }})
                window.scrollTo(0, 0);
                that.setState({outletAdded:'Outlet Added'})
                //location.reload()
            }else{
                that.setState({outletAdded:''})
                that.props.getOutlets();
                that.props.change('TABLE_PAGE');
            }
           
            // document.getElementById('back-button-id').click();
        }
       
      })
      .catch(function (error) {
       
      
      }.bind(this));
    }
      else{
        var that = this;
    return  axios({
        method: 'post',
        url: API_ROOT+'/api/outlets/updateByBrandName?brandName='+ window.location.href.split('#brandName=')[1],
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
     
        if(response.status == 200){
            if(text.length > 1){
                that.setState({fields:{
                'locationId':'',
               'uniqOutletQualities':'',
               'country':'',
               'streetNo':'',
               'street':'',
               'buildingName':'',
               'city':'',
               'state':'',
               'roadName1':'',
               'roadName2':'',
               'floor':'',
               'postalCode':'',
               'phone':'',
               'mondayFrom':moment(),
               'tuesdayFrom':moment(),
               'wednesdayFrom':moment(),
               'thursdayFrom':moment(),
               'fridayFrom':moment(),
               'saturdayFrom':moment(),
               'sundayFrom':moment(),
               'mondayTo':moment(),
               'tuesdayTo':moment(),
               'wednesdayTo':moment(),
               'thursdayTo':moment(),
               'fridayTo':moment(),
               'saturdayTo':moment(),
               'sundayTo':moment(),
                }})
                window.scrollTo(0, 0);
                that.setState({outletAdded:'Outlet Added'})
                //location.reload()
            }else{
                that.setState({outletAdded:''})
                that.props.getOutlets();
                that.props.change('TABLE_PAGE');
            }
           
            // document.getElementById('back-button-id').click();
        }
       
      })
      .catch(function (error) {
       
     
      }.bind(this));
      }
}
validateField(){
    let fields = this.state.fields;
    let errorBag = {};
    // value = moment();
    let formIsValid = true;
    if(!fields["locationId"]){
        formIsValid = false;
        errorBag["locationId"] = "This field is required.";
     }
    //  if(!fields["uniqOutletQualities"]){
    //     formIsValid = false;
    //     errorBag["uniqOutletQualities"] = "This field is required.";
    //  }
     if(!fields["country"] && fields['country'].length ==0){
        formIsValid = false;
        errorBag["country"] = "This field is required.";
     }
    //  if(!fields["unitNo"]){
    //     formIsValid = false;
    //     errorBag["unitNo"] = "This field is required.";
    //  }
     if(!fields["streetNo"]){
        formIsValid = false;
        errorBag["streetNo"] = "This field is required.";
     }    
     if(!fields["street"]){
        formIsValid = false;
        errorBag["street"] = "This field is required.";
     } 
    //  if(!fields["buildingName"]){
    //     formIsValid = false;
    //     errorBag["buildingName"] = "This field is required.";
    //  } 
     if(!fields["city"]){
        formIsValid = false;
        errorBag["city"] = "This field is required.";
     } 
    //  if(!fields["state"]){
    //     formIsValid = false;
    //     errorBag["state"] = "This field is required.";
    //  }
     if(!fields["postalCode"]){
        formIsValid = false;
        errorBag["postalCode"] = "This field is required.";
     } 
     if(!fields["phone"]){
        formIsValid = false;
        errorBag["phone"] = "This field is required.";
     } 
    //  if(!fields["mondayFrom"]){
    //     formIsValid = false;
    //     errorBag["mondayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["mondayTo"]){
    //     formIsValid = false;
    //     errorBag["mondayTo"] = "This field is required.";
    //  } 
    //  if(!fields["tuesdayFrom"]){
    //     formIsValid = false;
    //     errorBag["tuesdayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["tuesdayTo"]){
    //     formIsValid = false;
    //     errorBag["tuesdayTo"] = "This field is required.";
    //  } 
    //  if(!fields["wednesdayFrom"]){
    //     formIsValid = false;
    //     errorBag["wednesdayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["wednesdayTo"]){
    //     formIsValid = false;
    //     errorBag["wednesdayTo"] = "This field is required.";
    //  } 
    //  if(!fields["thursdayFrom"]){
    //     formIsValid = false;
    //     errorBag["thursdayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["thursdayTo"]){
    //     formIsValid = false;
    //     errorBag["thursdayTo"] = "This field is required.";
    //  } 
    //  if(!fields["fridayFrom"]){
    //     formIsValid = false;
    //     errorBag["fridayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["fridayTo"]){
    //     formIsValid = false;
    //     errorBag["fridayTo"] = "This field is required.";
    //  } 
    //  if(!fields["saturdayFrom"]){
    //     formIsValid = false;
    //     errorBag["saturdayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["saturdayTo"]){
    //     formIsValid = false;
    //     errorBag["saturdayTo"] = "This field is required.";
    //  } 
    //  if(!fields["sundayFrom"]){
    //     formIsValid = false;
    //     errorBag["sundayFrom"] = "This field is required.";
    //  } 
    //  if(!fields["sundayTo"]){
    //     formIsValid = false;
    //     errorBag["sundayTo"] = "This field is required.";
    //  } 
    //  if(!fields['floor']){
    //      formIsValid = false;
    //      errorBag['floor']='This field is required';
    //  }
    if(this.state.selected_COUNTRY != null)
    if(this.state.selected_COUNTRY.label != 'Singapore')
     if(!fields['roadName1']){
         formIsValid = false;
         errorBag['roadName1'] = 'This field is required'
     }
    //  if(!fields['roadName2']){
    //     formIsValid = false;
    //     errorBag['roadName2'] = 'This filed is required'
    // }
    if(this.state.selected_COUNTRY != null)
    if(this.state.selected_COUNTRY.label != 'Singapore')
    if(!fields['locality']){
        formIsValid = false;
        errorBag['locality'] = 'This field is required'
    }

   this.setState({errorBag: errorBag});
   return formIsValid;
    
    
}


  componentDidMount(){    
    
    setTimeout(()=>{
        if(this.props.sendData){
            this.makeform();
        }
    },2000)
   
  }
  componentWillReceiveProps(nextProp){
   
     if(this.props != nextProp){
      
        if(this.props.sendData){
            this.makeform();
        }
       }
  }


  
    
//   {
//     "locationId":int,
//     "phone":"string",
//     "status":"string",
//     "uniqOutletQualities":"string",
//     "url":"string",
//     "addressId":int,
//     "brandId":int,
//     "openingHoursId":int,
//     "tenantName":"int"
//     }

makeform(){
    let fields = this.state.fields;
    fields['locationId'] = this.props.sendData.locationId;
    fields['uniqOutletQualities'] = this.props.sendData.uniqOutletQualities || '';
    fields['country'] = this.props.sendData.address.country;
    this.setState({selected_COUNTRY:{value:this.props.sendData.address.country,label:this.props.sendData.address.country}})
    fields['city'] = this.props.sendData.address.city;
    fields['streetNo'] = this.props.sendData.address.streetNo;
    fields['street'] = this.props.sendData.address.street;
    fields['buildingName'] = this.props.sendData.address.building;
    fields['roadName1'] = this.props.sendData.address.roadName1;
    fields['roadName2'] = this.props.sendData.address.roadName2;
    fields['floor'] = this.props.sendData.address.floor;
    // fields['state'] = this.props.sendData.address.state;
    fields['postalCode'] = this.props.sendData.address.postalCode;
    fields['phone'] = this.props.sendData.phone;
    fields['unitNo'] = this.props.sendData.address.unitNo;
   
     var mon1 = new Date();
     var s = this.props.sendData.openingHours.monday.split(' - ')[0];
     var parts = s.match(/(\d+)\:(\d+):(\w+)/);
     var hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     var  minutes = parseInt(parts[2], 10);
     mon1.setHours(hours, minutes,0,0);
   
     mon1 = moment(mon1)
    fields['mondayFrom'] = mon1;


    var tue1 = new Date();
     s = this.props.sendData.openingHours.tuesday.split(' - ')[0];
     parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
    tue1.setHours(hours, minutes,0,0);
    tue1 = moment(tue1)
    fields['tuesdayFrom'] = tue1;



    var wed1 = new Date();
     s = this.props.sendData.openingHours.wednesday.split(' - ')[0];
      parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
      wed1.setHours(hours, minutes,0,0);
      wed1 = moment(wed1)
      fields['wednesdayFrom'] = wed1;



    var thur1 = new Date();
     s = this.props.sendData.openingHours.thursday.split(' - ')[0];
      parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
      thur1.setHours(hours, minutes,0,0);
      thur1 = moment(thur1)
    fields['thursdayFrom'] = thur1;


    var fri1 = new Date();
    s = this.props.sendData.openingHours.friday.split(' - ')[0];
    parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     fri1.setHours(hours, minutes,0,0);
     fri1 = moment(fri1)
    fields['fridayFrom'] = fri1;


    var sat1 = new Date();
    s = this.props.sendData.openingHours.saturday.split(' - ')[0];
    parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     sat1.setHours(hours, minutes,0,0);
     sat1 = moment(sat1)
    fields['saturdayFrom'] = sat1;



    var sun1 = new Date();
    s = this.props.sendData.openingHours.sunday.split(' - ')[0];
    parts =s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     sun1.setHours(hours, minutes,0,0);
     sun1 = moment(sun1)
    fields['sundayFrom'] = sun1;


    var mon2 = new Date();
     var s = this.props.sendData.openingHours.monday.split(' - ')[1];
     parts =s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     var  minutes = parseInt(parts[2], 10);
     mon2.setHours(hours, minutes,0,0);
     mon2 = moment(mon2)
    fields['mondayTo'] = mon2;



    var tue2 = new Date();
     s = this.props.sendData.openingHours.tuesday.split(' - ')[1];
      parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
    tue2.setHours(hours, minutes,0,0);
    tue2 = moment(tue2)
    fields['tuesdayTo'] = tue2;





    var wed2 = new Date();
     s = this.props.sendData.openingHours.wednesday.split(' - ')[1];
      parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
      wed2.setHours(hours, minutes,0,0);
      wed2 = moment(wed2)
    fields['wednesdayTo'] = wed2;


    var thur2 = new Date();
     s = this.props.sendData.openingHours.thursday.split(' - ')[1];
      parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      minutes = parseInt(parts[2], 10);
      thur2.setHours(hours, minutes,0,0);
      thur2 = moment(thur2)
    fields['thursdayTo'] = thur2;


    var fri2 = new Date();
    s = this.props.sendData.openingHours.friday.split(' - ')[1];
    parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     fri2.setHours(hours, minutes,0,0);
     fri2 = moment(fri2)
    fields['fridayTo'] = fri2;


    var sat2 = new Date();
    s = this.props.sendData.openingHours.saturday.split(' - ')[1];
    parts =s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     sat2.setHours(hours, minutes,0,0);
     sat2 = moment(sat2)
    fields['saturdayTo'] = sat2;



    var sun2 = new Date();
    s = this.props.sendData.openingHours.sunday.split(' - ')[1];
    parts = s.match(/(\d+)\:(\d+):(\w+)/);
     hours = /pm/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
     minutes = parseInt(parts[2], 10);
     sun2.setHours(hours, minutes,0,0);
     sun2 = moment(sun2)
    fields['sundayTo'] = sun2;
    this.setState({fields})
   
}


  render() {

const { selected_COUNTRY } = this.state;
const value = selected_COUNTRY && selected_COUNTRY.value;



    return (
        <div className="animated fadeIn">
            <form  onSubmit= {this.createOutlet.bind(this)}>
                <FormGroup >
                    <FormText color='green'>{this.state.outletAdded}</FormText>
                    <Label htmlFor="locationId" className='font-14'  style={{fontWeight:600}}>Outlet's Unique Location Identifier <span className='required'>*</span></Label>
                    <Input type="text" id="locationId" onBlur={this.checkOutlet} value={this.state.fields['locationId']} onChange={this.handleChange.bind(this, "locationId")} name="locationId" placeholder="Location name"/>
                    <FormText color="muted">Tip:  Use street name, Shopping Mall name or District Name to identify the specific location of the outlet in the city </FormText>
                    <FormText color='red'>{this.state.errorBag["locationId"]}</FormText>
                    {this.state.outletexist ? <FormText color='red'>Outlet exist. Enter some other Outlet</FormText> : <span></span> }
                </FormGroup>
                <FormGroup >
                    <Label htmlFor="uniqOutletQualities" className='font-14' style={{fontWeight:600}}>Unique Qualities of this Outlet</Label>
                    <Input type="text" id="uniqOutletQualities" value={this.state.fields['uniqOutletQualities']} name="uniqOutletQualities" onChange={this.handleChange.bind(this, "uniqOutletQualities")} placeholder="Unique qualities of your outlet"/>
                    <FormText color="muted">Example: different product specialty or different service provided that other outlets may not have </FormText>
                    <FormText color='red'>{this.state.errorBag["uniqOutletQualities"]}</FormText>
                </FormGroup>
                <p className='font-14' style={{fontWeight:600}}>Address <span className='required'>*</span></p>
                <FormGroup row className='margin-7'>
                <FormGroup  inline  className='col-md-6'>
                <Select
                        name="country"
                        id='country'
                
                        placeholder="Enter country"
                        value={selected_COUNTRY}
                        onChange={this.handleChange.bind(this, "country")}
                        options={this.state.country_LIST}
                      />
                    {/* <Input type="text" value={this.state.fields['country']} id="country" name="country" placeholder="Country" onChange={this.handleChange.bind(this, "country")}/> */}
                    <FormText color='red'>{this.state.errorBag["country"]}</FormText>
                </FormGroup>
                </FormGroup>
                {this.Address_RETURN_TYPE()}
                {/* 
                <FormGroup inline   className='col-md-6'>
                     
                    
                   
                      <Input type="text" id="city" name="city" value={this.state.fields['city']} placeholder="City" onChange={this.handleChange.bind(this, "city")}/>
                      <FormText color='red'>{this.state.errorBag["city"]}</FormText>
                      </FormGroup>
                  
                      </FormGroup>
                      <FormGroup row className='margin-7'>
                      <FormGroup inline className='col-md-3'>
                   
                   
                 
                
                   <Input type="number" id="unitNo" name="unitNo" value={this.state.fields['unitNo']} placeholder="Enter unit number" onChange={this.handleChange.bind(this, "unitNo")}/>
                   <FormText color='red'>{this.state.errorBag["unitNo"]}</FormText>
                </FormGroup>  
                      <FormGroup inline className='col-md-3'>
                     
                   
                  
                      <Input type="number" id="streetNo" value={this.state.fields['streetNo']} name="streetNo" placeholder="Street number" onChange={this.handleChange.bind(this, "streetNo")}/>
                      <FormText color='red'>{this.state.errorBag["streetNo"]}</FormText>
                      </FormGroup> 
                  <FormGroup   className='col-md-6'>
                   
                    <Input type="text" id="street" name="text-input5" value={this.state.fields['street']} placeholder="Street name" onChange={this.handleChange.bind(this, "street")}/>
                    <FormText color='red'>{this.state.errorBag["street"]}</FormText>
                </FormGroup>
               
                </FormGroup>
                <FormGroup row className='margin-7'>
                <FormGroup   className='col-md-4'>
                   
                    <Input type="text" id="building" name="building"  value={this.state.fields['building']} placeholder="Building name" onChange={this.handleChange.bind(this, "building")}/>
                    <FormText color='red'>{this.state.errorBag["building"]}</FormText>
                </FormGroup>
                      <FormGroup inline className='col-md-4'>
                    
                     
                   
                  
                      <Input type="text" id="state" name="state" value={this.state.fields['state']} placeholder="State" onChange={this.handleChange.bind(this, "state")}/>
                      <FormText color='red'>{this.state.errorBag["state"]}</FormText>
                      </FormGroup>
                      <FormGroup  inline   className='col-md-4'>
                  
                    <Input type="number" id="postalCode" value={this.state.fields['postalCode']} name="postalCode" placeholder="Postal code" onChange={this.handleChange.bind(this, "postalCode")}/>
                    <FormText color='red'>{this.state.errorBag["postalCode"]}</FormText>
                   
                </FormGroup>
                  </FormGroup> */}
                
                <FormGroup row>
                <FormGroup inline className='col-md-6'>
                    <Label htmlFor="phone" className='font-14' style={{fontWeight:600}}>Phone No. <span className='required'>*</span></Label>
                    <Input type="text" id="phone" name="phone"  value={this.state.fields['phone']} placeholder="Phone no." onChange={this.handleChange.bind(this, "phone")}/>
                    <FormText color='red'>{this.state.errorBag["phone"]}</FormText>
                </FormGroup>
                </FormGroup>
               
                <Label className='font-14' style={{fontWeight:600}}>Opening Hours</Label>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Monday</Label>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15}  showSecond={false}  placeholder='hh:mm'   id='mondayFrom' value={this.state.fields['mondayFrom']} name='mondayFrom' onChange={this.handleChangeTime.bind(this, "mondayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["mondayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} placeholder='hh:mm'   id='mondayTo' value={this.state.fields['mondayTo']} name='mondayTo' onChange={this.handleChangeTime.bind(this, "mondayTo")}/>
                    <FormText color='red'>{this.state.errorBag["mondayTo"]}</FormText>
                    
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    {/* <Button color="primary" onClick={this.applytime.bind(this)}> Apply to all </Button> */}
                    
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Tuesday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    {/* <Input type="text" id="text-input12a" name="text-input12a"  placeholder="Enter start time"/> */}
                    <TimePicker minuteStep={15}  showSecond={false} placeholder='hh:mm'     id='tuesdayFrom' value={this.state.fields['tuesdayFrom']} name='tuesdayFrom' onChange={this.handleChangeTime.bind(this, "tuesdayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["tuesdayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} placeholder='hh:mm'    id='tuesdayTo' value={this.state.fields['tuesdayTo']} name='tuesdayTo' onChange={this.handleChangeTime.bind(this, "tuesdayTo")}/>
                    <FormText color='red'>{this.state.errorBag["tuesdayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Wednesday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    <TimePicker minuteStep={15} showSecond={false}  placeholder='hh:mm'   id='wednesdayFrom'  value={this.state.fields['wednesdayFrom']} name='wednesdayFrom' onChange={this.handleChangeTime.bind(this, "wednesdayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["wednesdayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} placeholder='hh:mm'    id='wednesdayTo'  value={this.state.fields['wednesdayTo']} name='wednesdayTo' onChange={this.handleChangeTime.bind(this, "wednesdayTo")}/>
                    <FormText color='red'>{this.state.errorBag["wednesdayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Thursday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    <TimePicker minuteStep={15}  showSecond={false} placeholder='hh:mm'   id='thursdayFrom' value={this.state.fields['thursdayFrom']} name='thursdayFrom' onChange={this.handleChangeTime.bind(this, "thursdayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["thursdayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} placeholder='hh:mm'    id='thursdayTo' value={this.state.fields['thursdayTo']} name='thursdayTo' onChange={this.handleChangeTime.bind(this, "thursdayTo")}/>
                    <FormText color='red'>{this.state.errorBag["thursdayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Friday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    <TimePicker minuteStep={15} showSecond={false}  placeholder='hh:mm' value={this.state.fields['fridayFrom']}   id='fridayFrom' name='fridayFrom' onChange={this.handleChangeTime.bind(this, "fridayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["fridayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} value={this.state.fields['fridayTo']} placeholder='hh:mm'    id='fridayTo' name='fridayTo' onChange={this.handleChangeTime.bind(this, "fridayTo")}/>
                    <FormText color='red'>{this.state.errorBag["fridayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Saturday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    <TimePicker minuteStep={15} showSecond={false}  placeholder='hh:mm' value={this.state.fields['saturdayFrom']}   id='saturdayFrom' name='saturdayFrom' onChange={this.handleChangeTime.bind(this, "saturdayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["saturdayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} placeholder='hh:mm' value={this.state.fields['saturdayTo']}    id='saturdayTo' name='saturdayTo' onChange={this.handleChangeTime.bind(this, "saturdayTo")}/>
                    <FormText color='red'>{this.state.errorBag["saturdayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup row className='margin-7'>
                <Label style={{fontWeight:600}} className='col-md-2 font-14'>Sunday</Label>
                    <FormGroup inline className='col-md-2'>
                   
                    <TimePicker minuteStep={15} showSecond={false} value={this.state.fields['sundayFrom']} placeholder='hh:mm'   id='sundayFrom' name='sundayFrom' onChange={this.handleChangeTime.bind(this, "sundayFrom")}/>
                    <FormText color='red'>{this.state.errorBag["sundayFrom"]}</FormText>
                    </FormGroup>
                    <FormGroup inline className='col-md-2'>
                    <TimePicker minuteStep={15} showSecond={false} value={this.state.fields['sundayTo']} placeholder='hh:mm'   id='sundayTo' name='sundayTo' onChange={this.handleChangeTime.bind(this, "sundayTo")}/>
                    <FormText color='red'>{this.state.errorBag["sundayTo"]}</FormText>
                    </FormGroup>
                </FormGroup>
                <FormGroup >
                 
                      <Button color="save-button" onClick= {this.createOutlet.bind(this)}>Save</Button>
                      &nbsp;&nbsp;
                      <Button color="primary" onClick={this.createAnother.bind(this)}> Add another outlet </Button>
                    
                </FormGroup>
          </form>
          
         
         
         
       
        </div>
    )
  }
}

export default addOutlet;
