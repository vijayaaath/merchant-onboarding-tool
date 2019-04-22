import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader-spinner'
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


function validate(){

}




class Outlet extends Component {



  constructor(props) {
    super(props);
      
          
            
        
    };
  
  
 

  componentDidMount(){
   
  }
  ifprops(){
    
      if(this.props.viewOutlet.address){
          return <div className="animated fadeIn">
          <Card className='main-card-style'>
              
              <CardBody>
                  <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Outlet's Unique Location Identifier</Label>
                    <p className='text-capital'>{this.props.viewOutlet.locationId }</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Unique Qualities of this Outlet</Label>
                    <p>{this.props.viewOutlet.uniqOutletQualities || 'No unique quality'}</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Address</Label>
                    <p className='margin-less text-capital'>{this.props.viewOutlet.address.unitNo},{this.props.viewOutlet.address.floor}, {this.props.viewOutlet.address.buildingName}</p>
                    <p className='margin-less text-capital'>{this.props.viewOutlet.address.streetNo},{this.props.viewOutlet.address.streetName}</p>
                    <p className='margin-less text-capital'>{this.props.viewOutlet.address.roadName1} {this.props.viewOutlet.address.roadName2}, {this.props.viewOutlet.address.cityName}</p>
                    <p className='margin-less text-capital'>{this.props.viewOutlet.address.country}, {this.props.viewOutlet.address.postalCode}.</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Opening Hours</Label>
                    {/* <p>Monday <span className='left-margin'>{this.props.viewOutlet.openingHours.monday}</span></p>
                    <p>Tuesday <span className='left-margin'>{this.props.viewOutlet.openingHours.tuesday}</span></p>
                    <p>Wednesday <span className='left-margin'>{this.props.viewOutlet.openingHours.wednesday}</span></p>
                    <p>Thursday <span className='left-margin'>{this.props.viewOutlet.openingHours.thursday}</span></p>
                    <p>Friday <span className='left-margin'>{this.props.viewOutlet.openingHours.friday}</span></p>
                    <p>Saturday <span className='left-margin'>{this.props.viewOutlet.openingHours.saturday}</span></p>
                    <p>Sunday <span className='left-margin'>{this.props.viewOutlet.openingHours.sunday}</span></p> */}
                    <table>
                        <tbody>
                        <tr>
                            <th></th>
                            <th></th>
                            
                        </tr>
                        <tr>
                        <td>Monday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.monday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.monday.split('')[0]}{this.props.viewOutlet.openingHours.monday.split('')[1]}:{this.props.viewOutlet.openingHours.monday.split('')[3]}{this.props.viewOutlet.openingHours.monday.split('')[4]} - {this.props.viewOutlet.openingHours.monday.split('')[11]}{this.props.viewOutlet.openingHours.monday.split('')[12]}:{this.props.viewOutlet.openingHours.monday.split('')[14]}{this.props.viewOutlet.openingHours.monday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Tuesday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.tuesday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.tuesday.split('')[0]}{this.props.viewOutlet.openingHours.tuesday.split('')[1]}:{this.props.viewOutlet.openingHours.tuesday.split('')[3]}{this.props.viewOutlet.openingHours.tuesday.split('')[4]} - {this.props.viewOutlet.openingHours.tuesday.split('')[11]}{this.props.viewOutlet.openingHours.tuesday.split('')[12]}:{this.props.viewOutlet.openingHours.tuesday.split('')[14]}{this.props.viewOutlet.openingHours.tuesday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Wednesday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.wednesday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.wednesday.split('')[0]}{this.props.viewOutlet.openingHours.wednesday.split('')[1]}:{this.props.viewOutlet.openingHours.wednesday.split('')[3]}{this.props.viewOutlet.openingHours.wednesday.split('')[4]} - {this.props.viewOutlet.openingHours.wednesday.split('')[11]}{this.props.viewOutlet.openingHours.wednesday.split('')[12]}:{this.props.viewOutlet.openingHours.wednesday.split('')[14]}{this.props.viewOutlet.openingHours.wednesday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Thursday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.thursday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.thursday.split('')[0]}{this.props.viewOutlet.openingHours.thursday.split('')[1]}:{this.props.viewOutlet.openingHours.thursday.split('')[3]}{this.props.viewOutlet.openingHours.thursday.split('')[4]} - {this.props.viewOutlet.openingHours.thursday.split('')[11]}{this.props.viewOutlet.openingHours.thursday.split('')[12]}:{this.props.viewOutlet.openingHours.thursday.split('')[14]}{this.props.viewOutlet.openingHours.thursday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Friday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.friday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.friday.split('')[0]}{this.props.viewOutlet.openingHours.friday.split('')[1]}:{this.props.viewOutlet.openingHours.friday.split('')[3]}{this.props.viewOutlet.openingHours.friday.split('')[4]} - {this.props.viewOutlet.openingHours.friday.split('')[11]}{this.props.viewOutlet.openingHours.friday.split('')[12]}:{this.props.viewOutlet.openingHours.friday.split('')[14]}{this.props.viewOutlet.openingHours.friday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Saturday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.saturday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.saturday.split('')[0]}{this.props.viewOutlet.openingHours.saturday.split('')[1]}:{this.props.viewOutlet.openingHours.saturday.split('')[3]}{this.props.viewOutlet.openingHours.saturday.split('')[4]} - {this.props.viewOutlet.openingHours.saturday.split('')[11]}{this.props.viewOutlet.openingHours.saturday.split('')[12]}:{this.props.viewOutlet.openingHours.saturday.split('')[14]}{this.props.viewOutlet.openingHours.saturday.split('')[15]}</td>
                        
                        </tr>
                        <tr>
                        <td>Sunday</td>
                        {/* <td>{this.props.viewOutlet.openingHours.sunday}</td> */}
                        <td>{this.props.viewOutlet.openingHours.sunday.split('')[0]}{this.props.viewOutlet.openingHours.sunday.split('')[1]}:{this.props.viewOutlet.openingHours.sunday.split('')[3]}{this.props.viewOutlet.openingHours.sunday.split('')[4]} - {this.props.viewOutlet.openingHours.sunday.split('')[11]}{this.props.viewOutlet.openingHours.sunday.split('')[12]}:{this.props.viewOutlet.openingHours.sunday.split('')[14]}{this.props.viewOutlet.openingHours.sunday.split('')[15]}</td>
                        
                        </tr>
                        </tbody>
                    </table>
                </FormGroup>
              </CardBody>
          </Card>
        
       
       
       
     
      </div>
      }else{
          return <div className='loader-class'><div className="align-self-center loader"><img src="img/loader.gif" /></div></div>
      }
  }
  
 


    




  render() {
   

   
   return (
        this.ifprops()
    )
}
  }


export default Outlet;
